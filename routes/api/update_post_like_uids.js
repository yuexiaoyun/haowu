import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { Model as Post } from '../../mongodb_models/post';
import { createAction } from 'redux-actions';

module.exports = function*() {
    var post = yield Post.findOne({_id: this.query._id}).exec();
    if (!post)
        this.throw(404);
    var likes = post.likes.reverse();
    var users = yield findUsersByIds(this.session.user_id, likes);

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_post_like_uids')({
                _id: this.query._id,
                users,
                likes
            })
        ]
    }
};
