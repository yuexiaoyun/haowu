import { Model as Comment } from '../../mongodb_models/comment'
import { Model as Post } from '../../mongodb_models/post'
import notifyReply from '../../utility/msg/notify_reply';
import qiniu from '../../utility/qiniu';
import co from 'co';
import { createAction } from 'redux-actions'

module.exports = function*() {
    // 获取原评论信息，注意在被删除的评论下面仍然能接着回复，所以没有status=1的限制
    var comment = yield Comment.findOne({
        _id: this.query.comment_id
    }).exec();
    if (!comment)
        this.throw(404);

    // 检查回复的人确实在评论或者回复里
    var user_ids = [comment.user_id, ...comment.replies.map((reply)=>reply.user_id)];
    if (user_ids.indexOf(this.query.user_id) < 0)
        this.throw(403);

    // 保存回复
    // TODO: 竞态条件下comment.save()会失败
    var reply = {
        user_id: this.session.user_id,
        user_id2: this.query.user_id,
        text: this.query.text,
        audio_id: this.query.audio_id,
        d: this.query.d
    }
    if (reply.audio_id) {
        yield qiniu.sync(reply.audio_id),
        yield qiniu.pfop(reply.audio_id);
    }
    comment.uptime = new Date();
    comment.replies.push(reply);
    yield comment.save();
    reply = comment.replies[comment.replies.length - 1];

    co(notifyReply({
        user_id: this.session.user_id,
        nickname: this.session.userInfo.nickname,
        post_id: comment.post_id,
        comment_id: this.query.comment_id,
        reply
    })).catch(err=>console.log(err.stack));
    // 发送站内通知
    this.body = {
        result: 'ok',
        new_id: reply._id,
        actions: [
            createAction('update_comment')(comment)
        ]
    };
    console.log(this.body);
}
