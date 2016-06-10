import { parse_online_json } from './fetch_utils'

let store = null;

export function setStore(s) {
    store = s;
}

// TODO actions一次性更新？
export default function update(url, inspector) {
    return fetch(url, {credentials: 'same-origin'})
        .then(parse_online_json)
        .then(data=>{
            inspector && inspector(data);
            return data;
        })
        .then(({actions}) => actions.map(action=>store.dispatch(action)));
}
