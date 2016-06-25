import { handleActions } from 'redux-actions';
import _ from 'underscore';
import Immutable from 'immutable'

// TODO: 取消Immuable的依赖
// TODO: 各种分页加载
// TODO: 学习meteor，虚拟字段在reducers中merge

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
            ..._.object([window.openid], [[]])
        }
    },
    update_user_detail: (state, action) => {
        var { users, posts } = action.payload;
        return {
            ...state,
            ..._.object([users[0]._id], [posts.map(post=>post._id)])
        }
    },
    delete_post: (state, action) => {
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
    update_notifications: (state, action) => action.payload.notifications,
    delete_post: (state, action) => _.filter(state, item=>(item.target!=action.payload))
}, []);

// 自己的被订阅列表
export var subids = handleActions({
    update_notifications: (state, action) => action.payload.subids
}, []);

// 帖子的ID与内容对应
function update_posts(state, action) {
    var { posts } = action.payload;
    return { ...state, ..._.object(posts.map(post=>post._id), posts) }
}
export var posts = handleActions({
    update_feeds: update_posts,
    update_user_detail: update_posts,
    update_post_detail: update_posts,
    update_notifications: update_posts,
    pub_post: update_posts,
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
export var users = handleActions({
    update_post_like_uids: update_users,
    update_audio_read_uids: update_users,
    update_feeds: update_users,
    update_user_detail: update_users,
    update_post_detail: update_users,
    update_notifications: update_users,
    pub_post: update_users,
    set_intro: (state, action) => {
        var { intro } = action.payload;
        var user = state[window.user_id];
        if (user) {
            console.log(user);
            user = {
                ...user,
                intro
            }
            return {
                ...state,
                ..._.object([window.user_id], [user])
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
                ..._.object([user_id], [user])
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
    update_post_detail: (state, action) => {
        var { comments } = action.payload;
        var post_id = action.payload.posts[0]._id;
        return {
            ...state,
            ..._.object([post_id], [{comments}])
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
            ..._.object([action.payload.post_id], [post_detail])
        }
    }
}, {});

// 某一个具体语音的听过次数和我是否听过
function update_audios(state, action) {
    var { audios } = action.payload;
    return { ...state, ..._.object(audios.map(audio=>audio.audio_id), audios) }
}
export var audios = handleActions({
    update_feeds: update_audios,
    update_user_detail: update_audios,
    update_post_detail: update_audios,
    read: (state, action) => {
        var { audio_id } = action.payload;
        var audio = state[audio_id];
        if (!audio) {
            audio = {
                me_read: true,
                others_read_count: 0
            }
        } else {
            audio = {
                ...audio,
                me_read: true
            }
        }
        return { ...state, ..._.object([audio_id], [audio]) }
    }
}, {});

// 某一个具体帖子的赞列表
export var post_like_uids = handleActions({
    update_post_like_uids: (state, action) => {
        var {_id, users} = action.payload;
        return state.set(_id, users.map(user=>user._id));
    }
}, Immutable.Map());

// 某一个具体语音的听过列表
export var audio_read_uids = handleActions({
    update_audio_read_uids: (state, action) => {
        var {audio_id, users} = action.payload;
        return state.set(audio_id, users.map(user=>user._id));
    }
}, Immutable.Map());
