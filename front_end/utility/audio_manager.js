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

export function play(id) {
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
        store.dispatch(read(id));
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
