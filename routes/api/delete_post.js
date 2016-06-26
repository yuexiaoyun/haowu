import { Model as Post } from '../../mongodb_models/post';
import { Model as Notification } from '../../mongodb_models/notification';
import { createAction } from 'redux-actions';
import { updateCount } from '../../models/Count'

module.exports = function*() {
    var q = {
        _id: this.query._id,
        user_id: this.session.user_id
    };
    var d = {
        status: 0
    };
    var update = yield Post.update(q, d);
    if (update.nModified > 0) {
        var q = { target: this.query._id };
        // 删除所有目标为这篇帖子的互动区通知
        yield Notification.remove(q).exec();
        // 重算用户的发帖数和被听数
        yield updateCount(this.session.user_id);
        this.body = {
            result: 'ok',
            actions: [
                createAction('delete_post')(this.query._id)
            ]
        };
    } else {
        this.body = {
            result: 'ok',
            actions: []
        }
    }
}
