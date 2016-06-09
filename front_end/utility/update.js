import { parse_online_json } from './fetch_utils'

let store = null;

export function setStore(s) {
    store = s;
}

// TODO actions一次性更新？
// TODO redux使用reselect缓存部分二次计算结果
export default function update(url) {
    return fetch(url, {credentials: 'same-origin'})
        .then(parse_online_json)
        .then(({actions}) => actions.map(action=>store.dispatch(action)));
}
