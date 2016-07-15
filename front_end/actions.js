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
    post_id: payload.post_id,
    user_id: payload.user_id
})));
export var sub = createOptimistAction('sub', payload=>(`/api/${payload.sub ? 'sub' : 'unsub'}?_id=${payload.user_id}`));
export var set_intro = createOptimistAction('set_intro', payload=>('/api/set_intro?' + qs.stringify({
    intro: payload.intro
})));
export var set_title = createOptimistAction('set_title', payload=>('/api/set_title?' + qs.stringify({
    _id: payload._id,
    title: payload.title
})));
export var delete_topic = createOptimistAction('delete_topic', payload=>('/api/delete_topic?_id=' + payload));
