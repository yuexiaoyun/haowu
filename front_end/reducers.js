import { handleActions } from 'redux-actions';

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
export var home_scroll = handleActions({
    home_scroll: (state, action) => (action.payload || null),
    refresh: (state, action) => (null)
}, null);
export var me_scroll = handleActions({
    me_scroll: (state, action) => (action.payload || null),
    refresh: (state, action) => (null)
}, null);
export var current_tab = handleActions({
    current_tab: (state, action) => (action.payload)
}, 0);
export var myself = handleActions({
    myself: (state, action) => (action.payload.user),
    refresh: null
}, null);
export var my_post_ids = handleActions({
    myself: (state, action) => (action.payload.posts.map((post) => (post._id))),
    refresh: null
}, []);
export var feed_end = handleActions({
    feed_posts: (state, action) => ((!action.payload || action.payload.length == 0) ? 1 : 0),
    refresh: 0
}, 0);
export var feed_ids = handleActions({
    feed_posts: (state, action) => (action.payload.posts.map((post) => (post._id))),
    refresh: null
}, []);

var updatePosts = (state, action) => {
    var d = {};
    action.payload.posts.map((post) => {d[post._id] = post});
    return {...state, ...d};
}

export var posts = handleActions({
    feed_posts: updatePosts,
    myself: updatePosts,
    posts: updatePosts,
}, {});

export var likes = handleActions({
    like: (state, action) => {
        var d = {};
        d[action.payload] = 1;
        return {...state, ...d}
    },
    unlike:  (state, action) => {
        var d = {};
        d[action.payload] = 0;
        return {...state, ...d}
    }
}, {});

export var reads = handleActions({
    play_sound: (state, action) => {
        var d = {};
        d[action.payload] = 1;
        return {...state, ...d}
    }
}, {});
