import { handleActions } from 'redux-actions'
import _ from 'underscore'

export default handleActions({
    update_post_detail: (state, action) => {
        var { comments } = action.payload;
        var post_id = action.payload.posts[0]._id;
        return {
            ...state,
            [post_id]: {
                comments
            }
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
