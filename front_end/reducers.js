import { handleActions } from 'redux-actions';
import _ from 'underscore';

export audio_player from './ducks/audio_player';
export posts from './ducks/posts';
export users from './ducks/users';
export audios from './ducks/audios';
export topics from './ducks/topics';
export topic_editor from './ducks/topic_editor';
export user_post_ids from './ducks/user_post_ids';
export user_topic_ids from './ducks/user_topic_ids';
export route_state from './ducks/route_state';
export local_pic_id from './ducks/local_pic_id';
export home from './ducks/home';

// 自己的通知列表
export var notifications = handleActions({
    update_notifications: (state, action) => {
        var { notifications, concat } = action.payload;
        if (concat)
            return [...state, ...notifications];
        else
            return notifications
    },
    clear_notifications: (state, action) => [],
    delete_post: (state, action) => _.filter(state, item=>(item.target!=action.payload))
}, []);

export var notification_end = handleActions({
    update_notifications: (state, action) => action.payload.notification_end || 0,
    clear_notifications: (state, action) => 0
}, 0);

// 自己的被订阅列表
export var subids = handleActions({
    update_notifications: (state, action) => action.payload.subids || state
}, []);

// 帖子详情页的ID与内容对应
export var post_details = handleActions({
    update_post_detail: (state, action) => {
        var { comments } = action.payload;
        var post_id = action.payload.posts[0]._id;
        return {
            ...state,
            [post_id]: {comments}
        }
    },
    new_comment_reply: (state, action) => {
        var post_detail = state[action.payload.post_id];
        if (!post_detail)
            return state;
        var comments = [];
        var exists = false;
        post_detail.comments.map((comment)=>{
            if (comment._id == action.payload._id) {
                exists = true;
                comments.push(action.payload);
            }
            else
                comments.push(comment);
        });
        if (!exists)
            comments = [action.payload, ...comments];
        post_detail = {
            ...post_detail,
            comments: comments
        }
        return {
            ...state,
            [action.payload.post_id]: post_detail
        }
    }
}, {});

export var badge = handleActions({
    update_badge: (state, action) => ({
        count: action.payload.count,
        uid: action.payload.users.length > 0 ? action.payload.users[0]._id : null
    })
}, {});

export var tooltip = handleActions({
    update_tooltip: (state, action) => action.payload
}, 0);

export var pendings = handleActions({
    LOADING_START: (state, action) => ({
        ...state,
        [action.payload.id]: { err: null }
    }),
    LOADING_SUCCESS: (state, action) => ({
        ...state,
        [action.payload.id]: null
    }),
    LOADING_FAILED: (state, action) => ({
        ...state,
        [action.payload.id]: { err: 1 }
    })
}, {})
