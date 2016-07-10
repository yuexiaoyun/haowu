import { handleActions } from 'redux-actions';
import _ from 'underscore';

function update_posts(state, action) {
    var { posts } = action.payload;
    posts = posts.map(post => {
        var p = state[post._id];
        if (p) {
            post = {
                ...p,
                ...post
            }
        }
        return post;
    });
    return {
        ...state, ..._.object(posts.map(post=>post._id), posts)
    }
}

export default handleActions({
    update_feeds: update_posts,
    update_user_detail: update_posts,
    update_post_detail: update_posts,
    update_notifications: update_posts,
    update_topic: update_posts,
    pub_post: update_posts,
    like: (state, action) => {
        var id = action.payload;
        var post = state[id];
        if (post && !post.me_like) {
            post = {...post, me_like: true, like_count: post.like_count + 1}
            return {
                ...state,
                [id]: post
            }
        } else {
            return state;
        }
    },
    update_post_like_uids: (state, action) => {
        var {_id, users, likes} = action.payload;
        var post = state[_id];
        if (post)  {
            post = {
                ...post,
                me_like: likes.indexOf(window.user_id) >= 0,
                like_count: likes.length,
                likes
            }
            return {
                ...state,
                [_id]: post
            }
        } else {
            return state;
        }
    },
    set_title: (state, action) => {
        var { _id, title } = action.payload;
        var post = state[_id];
        if (post) {
            post = {
                ...post,
                title
            }
            return {
                ...state,
                [_id]: post
            }
        } else {
            return state;
        }
    }
}, {});
