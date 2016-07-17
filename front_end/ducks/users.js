import { handleActions } from 'redux-actions';
import _ from 'underscore';

// 用户的ID与内容对应
function update_users(state, action) {
    var { users } = action.payload;
    users = users.map(user => {
        var u = state[user._id];
        if (u) {
            user = {
                ...u,
                ...user
            }
        }
        return user;
    });
    return {
        ...state, ..._.object(users.map(user=>user._id), users)
    };
}
export default handleActions({
    update_post_like_uids: update_users,
    update_audio_read_uids: update_users,
    update_feeds: update_users,
    update_user_detail: update_users,
    update_post_detail: update_users,
    update_notifications: update_users,
    update_badge: update_users,
    update_topic: update_users,
    update_topics: update_users,
    update_users: update_users,
    pub_post: update_users,
    set_intro: (state, action) => {
        var { intro } = action.payload;
        var user = state[window.user_id];
        if (user) {
            user = {
                ...user,
                intro
            }
            return {
                ...state,
                [window.user_id]: user
            }
        } else {
            return state;
        }
    },
    read: (state, action) => {
        var { user_id } = action.payload;
        var user = state[user_id];
        if (user) {
            user = {
                ...user,
                reads_count: user.reads_count + 1
            }
            return {
                ...state,
                [user_id]: user
            }
        } else {
            return state;
        }
    },
    sub: (state, action) => {
        var { user_id, sub } = action.payload;
        var user = state[user_id];
        if (user) {
            user = {
                ...user,
                subbed_count: user.subbed_count + (sub ? 1 : (-1)),
                subbed: sub
            };
            return {
                ...state,
                [user_id]: user
            }
        } else {
            return state;
        }
    }
}, {});
