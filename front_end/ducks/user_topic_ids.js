import { createAction, handleActions } from 'redux-actions';
import _ from 'underscore';

// 某个用户的专辑列表
export default handleActions({
    pub_topic: (state, action) => {
        return {
            ...state,
            [window.user_id]: []
        }
    },
    update_user_detail: (state, action) => {
        var { users, topics } = action.payload;
        return {
            ...state,
            [users[0]._id]: topics.map(topic=>topic._id)
        }
    },
    delete_topic: (state, action) => {
        var my_topic_ids = state[window.user_id];
        if (my_topic_ids) {
            my_topic_ids = _.filter(my_topic_ids, item=>(item!=action.payload))
            return {
                ...state,
                [window.user_id]: my_topic_ids
            };
        } else {
            return state;
        }
    }
}, {});
