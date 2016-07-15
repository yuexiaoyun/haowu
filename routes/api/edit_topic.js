import { Model as Topic } from '../../mongodb_models/topic'
import { createAction } from 'redux-actions'

module.exports = function*() {
    // TODO: 检查专辑中的帖子都是本人发的
    var topic = yield Topic.findOne({
        _id: this.query._id,
        user_id: this.session.user_id
    });
    if (!topic)
        this.throw(404);
    topic.posts = this.query.post_ids.split(',');
    topic.title = this.query.title;
    yield topic.save();
    this.body = {
        result: 'ok',
        actions: [
            createAction('pub_topic')({
                topic
            })
        ]
    };
}
