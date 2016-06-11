import { createAction } from 'redux-actions';
import { parse_online_json } from './utility/fetch_utils'

export var like = createAction('like', (payload)=>payload, (payload)=>{
    var url = '/api/like?_id=' + payload;
    var promise = fetch(url, {credentials: 'same-origin'})
        .then(parse_online_json);
    return {
        promise,
        optimist: true
    }
});

export var sub = createAction('sub', (payload)=>payload, (payload)=>{
    var url = `/api/${payload.sub ? 'sub' : 'unsub'}?openid=${payload.openid}`;
    var promise = fetch(url, {credentials: 'same-origin'})
        .then(parse_online_json);
    return {
        promise,
        optimist: true
    }
});
