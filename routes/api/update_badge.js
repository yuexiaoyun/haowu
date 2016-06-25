import { Model as User } from '../../mongodb_models/user';
import { Model as Notification } from '../../mongodb_models/notification';
import { createAction } from 'redux-actions';
import _ from 'underscore';

export default function*() {
    var user = yield User.findById(this.session.user_id).select('clear_badge').exec();
    var clear_badge = user.clear_badge || new Date(0);
    var badge = yield Notification.count({
        user_id: this.session.user_id,
        uptime: { $gt: clear_badge }
    });
    this.body = {
        result: 'ok',
        actions: [
            createAction('update_badge')(badge)
        ]
    }
}
