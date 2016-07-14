import { createAction, handleActions } from 'redux-actions';
import _ from 'underscore';

// 某个用户的发布列表
export default handleActions({
    pub_post: (state, action) => {
        return {
            ...state,
            [window.user_id]: []
        }
    },
    update_user_detail: (state, action) => {
        var { users, posts } = action.payload;
        return {
            ...state,
            [users[0]._id]: posts.map(post=>post._id)
        }
    },
    delete_post: (state, action) => {
        var my_post_ids = state[window.user_id];
        if (my_post_ids) {
            my_post_ids = _.filter(my_post_ids, item=>(item!=action.payload))
            return {
                ...state,
                [window.user_id]: my_post_ids
            };
        } else {
            return state;
        }
    }
}, {});
