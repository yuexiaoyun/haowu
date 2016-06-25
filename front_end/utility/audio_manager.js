import fconf from '../fconf'
import { createAction } from 'redux-actions'
import { read } from '../actions'

let store;

let timer;
let player;
let current_id;

export function setStore(s) {
    store = s;
}

export function play(id, post_id, user_id) {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    if (player)
        player.pause();
    var url = fconf.qiniu.site + id + '_mp3';
    player = new Audio(url);
    current_id = id;
    player.load();
    store.dispatch(createAction('load')(id));
    player.addEventListener('canplaythrough', () => {
        player.play();
        console.log('canplaythrough: ' + id);
        var audio = store.getState().audios[id];
        if (!audio || !audio.me_read) {
            store.dispatch(read({
                audio_id: id,
                post_id: post_id,
                user_id: user_id
            }));
        }
        store.dispatch(createAction('canplay')(id));
        timer = setInterval(() => {
            store.dispatch(createAction('playing')(id));
        }, 100);
    });
    player.addEventListener('ended', () => {
        stop(id);
    });
}

export function stop(id) {
    if (id != current_id)
        return;
    store.dispatch(createAction('ended')(id));
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    player.pause();
    player = null;
    current_id = null;
}
