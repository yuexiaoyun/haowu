import { Model as Comment } from '../../mongodb_models/comment'
import { Model as Post } from '../../mongodb_models/post'
import { Model as User } from '../../mongodb_models/user'
import notifyReply from '../../utility/msg/notify_reply';
import qiniu from '../../utility/qiniu';
import co from 'co';
import { createAction } from 'redux-actions'

module.exports = function*() {
    // 获取用户是否存在，以及是否被封禁了评论和回复权限
    var user = yield User.findById(this.session.user_id)
        .select('block_comment_reply')
        .exec();
    if (!user || user.block_comment_reply == 1)
        this.throw(403);

    // 做好回复的七牛相关处理
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

    // 插入回复，并检查被回复的人确实在评论或者回复里出现
    var comment = yield Comment.findOneAndUpdate({
        _id: this.query.comment_id,
        $or: [{
            user_id: this.query.user_id
        }, {
            'replies.user_id': this.query.user_id
        }]
    }, {
        $push: {
            replies: reply
        },
        $set: {
            uptime: new Date()
        }
    }, {
        new: true
    }).exec();

    if (!comment)
        this.throw(404);
    reply = comment.replies[comment.replies.length - 1];

    // 发送通知
    co(notifyReply({
        user_id: this.session.user_id,
        nickname: this.session.userInfo.nickname,
        post_id: comment.post_id,
        comment_id: this.query.comment_id,
        reply
    })).catch(err=>console.log(err.stack));

    this.body = {
        result: 'ok',
        new_id: reply._id,
        actions: [
            createAction('new_comment_reply')(comment)
        ]
    };
    console.log(this.body);
}
