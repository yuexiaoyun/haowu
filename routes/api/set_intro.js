import { Model as User } from '../../mongodb_models/user';

module.exports = function*() {
    yield User.update({
        _id: this.session.user_id
    }, {
        intro: this.query.intro
    })
    this.body = yield {
        result: 'ok'
    };
}
