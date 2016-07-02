import { Model as UserPostPing } from '../../mongodb_models/user_post_ping'

module.exports = function *() {
    var q = {
        user_id: this.session.user_id,
        post_id: this.query.post_id,
        type: this.query.type
    }
    var d = q;
    yield UserPostPing.update(q, d, {upsert: true});
    this.body = {
        result: 'ok'
    };
}
