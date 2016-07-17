import { Model as User } from '../../mongodb_models/user';
import { Model as Notification } from '../../mongodb_models/notification';
import { updateCount } from '../../models/Count'
import co from 'co';

module.exports = function*() {
    var q = { _id: this.query._id };
    var d = {
        $pull: {
            subids: this.session.user_id
        }
    };
    var update = yield User.update(q, d);
    yield updateCount(this.session.user_id);
    this.body = yield {
        result: 'ok'
    };
}
