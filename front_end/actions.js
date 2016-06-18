import { createAction } from 'redux-actions';
import { parse_online_json } from './utility/fetch_utils';
import qs from 'querystring';

function createOptimistAction(name, f) {
    return createAction(name, (payload)=>payload, (payload)=>{
        var promise = fetch(f(payload), {credentials: 'same-origin'})
            .then(parse_online_json);
        return {
            promise,
            optimist: true
        }
    });
}

export var like = createOptimistAction('like', payload=>('/api/like?_id=' + payload));
export var read = createOptimistAction('read', payload=>('/api/read?' + qs.stringify({
    audio_id: payload.audio_id,
    post_id: payload.post_id
})));
export var sub = createOptimistAction('sub', payload=>(`/api/${payload.sub ? 'sub' : 'unsub'}?_id=${payload.user_id}`));
