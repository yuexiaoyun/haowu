import { Model as Comment } from '../../mongodb_models/comment'
import { Model as Post } from '../../mongodb_models/post'
import qiniu from '../../utility/qiniu';
import co from 'co';
import notifyComment from '../../utility/msg/notify_comment';
import { createAction } from 'redux-actions'

export default function*() {
    var post = yield Post.findOne({
        _id: this.query.post_id,
        status: {$ne: 0}
    }).select('user_id').exec();

    if (!post)
        this.throw(404);

    // 开始生成这一条评论。注意只有物主才能用语音评论
    var comment = new Comment();
    Object.assign(comment, this.query);
    comment.user_id = this.session.user_id;
    if (post.user_id != this.session.user_id) {
        comment.audio_id = null;
        comment.d = null;
    }
    if (comment.audio_id) {
        yield qiniu.sync(comment.audio_id),
        yield qiniu.pfop(comment.audio_id);
    }
    comment.status = 1;
    comment.uptime = new Date();
    yield comment.save();

    if (this.session.user_id != post.user_id) {
        co(notifyComment({
            user_id: this.session.user_id,
            nickname: this.session.userInfo.nickname,
            post_id: this.query.post_id,
            post_user_id: post.user_id,
            comment
        })).catch(err=>console.log(err.stack));
    }
    this.body = {
        result: 'ok',
        new_id: comment._id,
        actions: [
            createAction('update_comment')(comment)
        ]
    };
}
