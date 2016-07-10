import { handleActions } from 'redux-actions';
import _ from 'underscore';

export audio_player from './ducks/audio_player';
export posts from './ducks/posts';
export users from './ducks/users';
export audios from './ducks/audios';
export topics from './ducks/topics';

export var local_pic_id = handleActions({
    take_pic: (state, action) => (action.payload)
}, null);

// 首页feed的id列表
export var feed_ids = handleActions({
    pub_post: (state, action) => [action.payload.posts[0]._id, ...state],
    update_feeds: (state, action) => {
        var { posts, concat } = action.payload;
        var ids = posts.map(post=>post._id);
        if (concat)
            return [...state, ...ids];
        else
            return [...ids, ...state];
    },
    delete_post: (state, action) => _.filter(state, item=>(item!=action.payload))
}, []);

// 首页feed是否已完全加载
export var feed_end = handleActions({
    update_feeds: (state, action) => action.payload.feed_end,
    feed_end: (state, action) => action.payload
}, 0);

// 某个用户的发布列表
export var user_post_ids = handleActions({
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

// 自己的通知列表
export var notifications = handleActions({
    update_notifications: (state, action) => {
        var { notifications, concat } = action.payload;
        if (concat)
            return [...state, ...notifications];
        else
            return notifications
    },
    delete_post: (state, action) => _.filter(state, item=>(item.target!=action.payload))
}, []);

export var notification_end = handleActions({
    update_notifications: (state, action) => action.payload.notification_end || 0
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
    update_comment: (state, action) => {
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
