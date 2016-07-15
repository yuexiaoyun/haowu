import { Model as Topic } from '../../mongodb_models/topic'
import { createAction } from 'redux-actions'

module.exports = function*() {
    // TODO: 检查专辑中的帖子都是本人发的
    var topic = new Topic();
    topic.user_id = this.session.user_id;
    topic.posts = this.query.post_ids.split(',');
    topic.title = this.query.title;
    topic.status = 1;
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
