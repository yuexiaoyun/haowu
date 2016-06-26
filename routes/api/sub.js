import { Model as User } from '../../mongodb_models/user';
import { Model as Notification } from '../../mongodb_models/notification';

module.exports = function*() {
    var q = { _id: this.query._id };
    var d = {
        $addToSet: {
            subids: this.session.user_id
        }
    };
    var update = yield User.update(q, d);
    console.log(update);
    if (update.nModified > 0 && this.query._id != this.session.user_id) {
        var query = {
            user_id: this.query._id,
            type: 'sub'
        }
        console.log(yield Notification.update(query, {
            ...query,
            user_id2: this.session.user_id,
            uptime: new Date()
        }, { upsert: true }));
    }
    this.body = yield {
        result: 'ok'
    };
}
