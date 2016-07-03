import { Model as UserPostPing } from '../../mongodb_models/user_post_ping'
import co from 'co'
import { updateScore } from '../../models/Score'

module.exports = function *() {
    var q = {
        user_id: this.session.user_id,
        post_id: this.query.post_id,
        type: this.query.type
    }
    var d = q;
    yield UserPostPing.update(q, d, {upsert: true});
    co(updateScore(this.query.post_id));
    this.body = {
        result: 'ok'
    };
}
