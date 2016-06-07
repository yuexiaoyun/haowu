import { handleActions } from 'redux-actions';
import _ from 'underscore';

export var local_pic_id = handleActions({
    take_pic: (state, action) => (action.payload)
}, null);
export var sound_id = handleActions({
    play_sound: (state, action) => (action.payload),
    stop_play: (state, action) => (action.payload == state ? null: state)
}, null);
export var sound_playing = handleActions({
    play_sound: (state, action) => (new Date())
}, null);
export var my_badge = handleActions({
    current_myself_tab: (state, action) => (action.payload == 1 ? 0 : state)
}, window.my_badge);
export var my_badge2 = handleActions({
    clear_badge2: (state, action) => 0
}, window.my_badge);


// 首页feed的id列表
export var feed_ids = handleActions({
    feed_ids: (state, action) => action.payload,
    feed_ids_more: (state, action) => [...state, ...action.payload]
}, []);
// 首页feed是否已完全加载
export var feed_end = handleActions({
    feed_end: (state, action) => action.payload
}, 0);
// 某个用户的发布列表
export var user_post_ids = handleActions({
    user_post_ids: (state, action) => ({...state, ...action.payload})
}, {});
// 自己的通知列表
export var notifications = handleActions({
    notifications: (state, action) => action.payload
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
    },
    read: (state, action) => {
        var id = action.payload;
        var post = state[id];
        if (post) {
            post = {...post, me_read: true}
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
    })
}, {});
// 帖子详情页的ID与内容对应
export var post_details = handleActions({
    post_details: (state, action) => ({
        ...state, ...action.payload
    })
}, {});
