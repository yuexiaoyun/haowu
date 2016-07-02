import { Model as User, findUserById } from '../../mongodb_models/user';
import { Model as Notification } from '../../mongodb_models/notification';
import { createAction } from 'redux-actions';
import _ from 'underscore';

module.exports = function*() {
    var user = yield User.findById(this.session.user_id).select('clear_badge').exec();
    var clear_badge = user.clear_badge || new Date(0);
    var q = {
        user_id: this.session.user_id,
        uptime: { $gt: clear_badge }
    }
    var count = yield Notification.count(q);
    var result = { count }
    if (count > 0) {
        var notification = yield Notification.findOne(q).sort({uptime: -1}).select('user_id2').exec();
        console.log(notification);
        var uid = notification.user_id2;
        result.users = [yield findUserById(this.session.user_id, uid)];
    } else {
        result.users = [];
    }
    this.body = {
        result: 'ok',
        actions: [
            createAction('update_badge')(result)
        ]
    }
}
