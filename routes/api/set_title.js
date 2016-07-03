import { Model as Post } from '../../mongodb_models/post';

module.exports = function*() {
    yield Post.update({
        _id: this.query._id,
        user_id: this.session.user_id
    }, {
        title: this.query.title
    });
    this.body = yield {
        result: 'ok'
    };
};
