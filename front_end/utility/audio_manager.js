import fconf from '../fconf'
import { createAction } from 'redux-actions'
import { read } from '../actions'

let store;

let timer;
let audio;
let current_id;

export function setStore(s) {
    store = s;
}

// TODO: 想办法搞定小菊花
export function play(id, post_id, user_id) {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    if (audio)
        audio.pause();
    var url = fconf.qiniu.site + id + '_mp3';
    audio = new Audio(url);
    current_id = id;
    audio.play();
    store.dispatch(createAction('load')(id));
    audio.addEventListener('canplay', () => {
        console.log('canplay: ' + id);
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
    audio.addEventListener('ended', () => {
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
    audio.pause();
    audio = null;
    current_id = null;
}
