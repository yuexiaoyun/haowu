import { Model as User } from '../../mongodb_models/user';
import { Model as Notification } from '../../mongodb_models/notification';

export default function*() {
    var q = { _id: this.query._id };
    var d = {
        $pull: {
            subids: this.session.user_id
        }
    };
    var update = yield User.update(q, d);
    this.body = yield {
        result: 'ok'
    };
    console.log(JSON.stringify(this.body));
}
