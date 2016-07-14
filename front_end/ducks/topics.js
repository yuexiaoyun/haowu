import { handleActions } from 'redux-actions';
import _ from 'underscore';

function update_topics(state, action) {
    var { topics } = action.payload;
    topics = topics.map(topic => {
        var t = state[topic._id] || {};
        topic = {
            ...t,
            ...topic
        }
        return topic;
    });
    return {
        ...state,
        ..._.object(topics.map(topic=>topic._id), topics)
    };
}

export default handleActions({
    update_topic: (state, action) => {
        var { topic } = action.payload;
        return {
            ...state,
            [topic._id]: topic
        }
    },
    pub_topic: (state, action) => {
        var { topic } = action.payload;
        return {
            ...state,
            [topic._id]: topic
        }
    },
    update_user_detail: update_topics
}, {});
