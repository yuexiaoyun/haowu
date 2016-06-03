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
    refresh: (state, action) => (null)
}, null);
export var my_post_ids = handleActions({
    myself: (state, action) => (action.payload.posts.map((post) => (post._id))),
    refresh: (state, action) => ([])
}, []);
export var feed_end = handleActions({
    feed_posts: (state, action) => ((action.payload.posts.length == 0) ? 1 : 0),
    refresh: (state, action) => (0)
}, 0);
export var feed_ids = handleActions({
    feed_posts: (state, action) => {
        var ids = action.payload.posts.map((post) => (post._id));
        return [...state, ...ids];
    },
    refresh: (state, action) => ([])
}, []);
export var current_myself_tab = handleActions({
    current_myself_tab: (state, action) => (action.payload)
}, 0);
export var my_badge = handleActions({
    current_myself_tab: (state, action) => (action.payload == 1 ? 0 : state)
}, 2);

var updatePosts = (state, action) => {
    var d = {};
    action.payload.posts.map((post) => {
        if (action.payload.user)
            post.user = action.payload.user;
        d[post._id] = post;
    });
    return {...state, ...d};
}

export var posts = handleActions({
    feed_posts: updatePosts,
    myself: updatePosts,
    posts: updatePosts,
}, {});

var updateLikes = (state, action) => {
    var d = {};
    action.payload.posts.map((post) => {
        if (post.likes && post.likes.indexOf(window.openid) >= 0)
            d[post._id] = 1;
        else
            d[post._id] = 0;
    });
    return {...state, ...d};
}
export var likes = handleActions({
    feed_posts: updateLikes,
    myself: updateLikes,
    posts: updateLikes,
    like: (state, action) => {
        var d = {};
        d[action.payload] = 1;
        return {...state, ...d}
    }
}, {});

var updateReads = (state, action) => {
    var d = {};
    action.payload.posts.map((post) => {
        if (post.reads && post.reads.indexOf(window.openid) >= 0)
            d[post._id] = 1;
        else
            d[post._id] = 0;
    });
    return {...state, ...d};
}
export var reads = handleActions({
    feed_posts: updateReads,
    myself: updateReads,
    posts: updateReads,
    play_sound: (state, action) => {
        var d = {};
        d[action.payload] = 1;
        return {...state, ...d}
    }
}, {});
