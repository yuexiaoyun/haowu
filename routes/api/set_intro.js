import { Model as User } from '../../mongodb_models/user';

export default function*() {
    yield User.update({
        _id: this.session.user_id
    }, {
        intro: this.query.intro
    })
    this.body = yield {
        result: 'ok'
    };
}
