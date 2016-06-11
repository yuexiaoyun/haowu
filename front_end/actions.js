import { createAction } from 'redux-actions';
import { parse_online_json } from './utility/fetch_utils'

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
export var read = createOptimistAction('read', payload=>('/api/read?audio_id=' + payload));
export var sub = createOptimistAction('sub', payload=>(`/api/${payload.sub ? 'sub' : 'unsub'}?user_id=${payload.user_id}`));
