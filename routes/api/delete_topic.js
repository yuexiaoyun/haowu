import { Model as Topic } from '../../mongodb_models/topic';

module.exports = function*() {
    var q = {
        _id: this.query._id,
        user_id: this.session.user_id
    };
    var d = {
        status: 0
    };
    var update = yield Topic.update(q, d);
    this.body = {
        result: 'ok'
    };
}
