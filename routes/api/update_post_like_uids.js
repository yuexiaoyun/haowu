import { Model as User } from '../../mongodb_models/user';
import { Model as Post } from '../../mongodb_models/post';
import { createAction } from 'redux-actions';

export default function*() {
    var post = yield Post.findOne({_id: this.query._id}).exec();
    if (!post)
        this.throw(404);
    var users = yield User.find(
        {_id: { $in: post.likes}}
    ).select('_id headimgurl nickname subids status').exec();
    users = users.map(user=>User.toBrowser(user, this.session.user_id));

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_post_like_uids')({
                _id: this.query._id,
                users
            })
        ]
    }
}
