import { Model as Audio } from '../../mongodb_models/audio';
import notifyRead from '../../utility/msg/notify_read';
import co from 'co';

export default function *() {
    var q = { audio_id: this.query.audio_id };
    var d = {
        $addToSet: {
            reads: this.session.user_id
        }
    };
    var update = yield Audio.update(q, d, {upsert: true});
    console.log(update);
    if (update.nModified > 0 && this.query.user_id && this.query.post_id) {
        co(notifyRead({
            user_id: this.session.user_id,
            post_user_id: this.query.user_id,
            post_id: this.query.post_id,
        })).catch(console.log);
    }
    this.body = yield {
        result: 'ok'
    };
}
