import { Model as Post } from '../../mongodb_models/post'
import notifyLike from '../../utility/msg/notify_like';
import co from 'co';

export default function* () {
    var q = { _id: this.query._id, status: {$ne: 0} };
    var d = {
        $addToSet: {
            likes: this.session.user_id
        }
    };
    var update = yield Post.update(q, d);
    console.log(update);
    if (update.nModified > 0) {
        console.log(1);
        co(notifyLike({
            user_id: this.session.user_id,
            nickname: this.session.userInfo.nickname,
            post_id: this.query._id
        })).catch(console.log);
    }
    this.body = {
        result: 'ok'
    };
}
