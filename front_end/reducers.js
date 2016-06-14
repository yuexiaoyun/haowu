import { handleActions } from 'redux-actions';
import _ from 'underscore';
import Immutable from 'immutable'

// TODO: 全部用immutablejs重写？
// TODO: 各种分页加载
export var audio_player = handleActions({
    load: (state, action) => ({
        id: action.payload,
        play_state: 'loading'
    }),
    canplay: (state, action) => ({
        id: action.payload,
        play_state: 'playing',
        start: new Date(),
        time: 0
    }),
    playing: (state, action) => ({
        id: action.payload,
        play_state: 'playing',
        start: state.start,
        time: new Date() - state.start
    }),
    ended: (state, action) => ({})
}, {});
export var local_pic_id = handleActions({
    take_pic: (state, action) => (action.payload)
}, null);

// 首页feed的id列表
export var feed_ids = handleActions({
    feed_ids: (state, action) => action.payload,
    feed_ids_more: (state, action) => [...state, ...action.payload],
    delete_my_post: (state, action) => _.filter(state, item=>(item!=action.payload))
}, []);
// 首页feed是否已完全加载
export var feed_end = handleActions({
    feed_end: (state, action) => action.payload
}, 0);
// 某个用户的发布列表
export var user_post_ids = handleActions({
    user_post_ids: (state, action) => ({...state, ...action.payload}),
    delete_my_post: (state, action) => {
        var my_post_ids = state[window.user_id];
        if (my_post_ids) {
            my_post_ids = _.filter(my_post_ids, item=>(item!=action.payload))
            var r = {
                ...state,
                ..._.object([window.user_id], [my_post_ids])
            };
            return r;
        } else {
            return state;
        }
    }
}, {});
// 自己的通知列表
export var notifications = handleActions({
    notifications: (state, action) => action.payload,
    delete_my_post: (state, action) => _.filter(state, item=>(item.target!=action.payload))
}, []);
// 自己的被订阅列表
export var subids = handleActions({
    subids: (state, action) => action.payload
}, []);
// 帖子的ID与内容对应
export var posts = handleActions({
    posts: (state, action) => ({
        ...state, ...action.payload
    }),
    like: (state, action) => {
        var id = action.payload;
        var post = state[id];
        if (post) {
            post = {...post, me_like: true}
            return {...state, ...(_.object([id], [post]))}
        } else {
            return state;
        }
    }
}, {});
// 用户的ID与内容对应
export var users = handleActions({
    users: (state, action) => ({
        ...state, ...action.payload
    }),
    sub: (state, action) => {
        var { user_id, sub } = action.payload;
        var user = state[user_id];
        if (user) {
            user = {
                ...user,
                subbed: sub
            };
            return {
                ...state,
                ..._.object([user_id], [user])
            }
        } else {
            return state;
        }
    }
}, {});
// 帖子详情页的ID与内容对应
export var post_details = handleActions({
    post_details: (state, action) => ({
        ...state, ...action.payload
    }),
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
            ..._.object([action.payload.post_id], [post_detail])
        }
    }
}, {});
// 上一次清badge的时间
export var clear_badge_time = handleActions({
    clear_badge_time: (state, action) => action.payload
}, null);

// 我听过的语音
export var reads = handleActions({
    reads: (state, action) => state.merge(action.payload),
    read: (state, action) => state.add(action.payload)
}, Immutable.Set());
