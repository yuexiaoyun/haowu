import { parse_online_json } from './fetch_utils'
import { batchActions } from 'redux-batched-actions';

let store = null;

export function setStore(s) {
    store = s;
}

export default function update(url, inspector) {
    return fetch(url, {credentials: 'same-origin'})
        .then(parse_online_json)
        .then(data=>{
            inspector && inspector(data);
            return data;
        })
        .then(({actions}) => store.dispatch(batchActions(actions)));
}
