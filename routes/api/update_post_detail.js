import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { Model as Post, findPostById } from '../../mongodb_models/post';
import { Model as Audio } from '../../mongodb_models/audio';
import { Model as Comment } from '../../mongodb_models/comment';
import { Model as Topic } from '../../mongodb_models/topic';
import { createAction } from 'redux-actions';
import _ from 'underscore';

module.exports = function*() {
    // 获取原始Post
    var post = yield findPostById(this.session.user_id, this.query._id);
    if (!post || post.status == 0)
        this.throw(404);

    // 获取评论、回复和所有评论、回复、点赞中出现的user_id对应的用户
    var comments = yield Comment.find({post_id: this.query._id}).sort({_id: -1}).exec();
    var comment_user_ids = comments.map((comment)=>comment.user_id);
    var replies = _.flatten(comments.map((comment)=>comment.replies));
    var reply_uids = replies.map((reply)=>reply.user_id);
    var users = yield findUsersByIds(this.session.user_id, _.uniq([
            this.session.user_id,    // 自己的user_id，评论上屏时需要用到自己的个人信息
            post.user_id,
            ...comment_user_ids,
            ...reply_uids
        ])
    );

    // 获取原贴、评论、回复中出现的语音的已读状态和阅读数
    var comment_audio_ids = comments.map(comment => comment.audio_id);
    var reply_audio_ids = replies.map(reply => reply.audio_id);
    var audio_ids = _.uniq(_.compact([
        post.audio_id,
        ...comment_audio_ids,
        ...reply_audio_ids
    ]));
    var audios = yield Audio.find({
        audio_id: { $in: audio_ids },
    }).select('audio_id reads').exec();

    // TODO: 所属专辑的index
    var topics = yield Topic.find({
        status: 1,
        posts: this.query._id
    }).select('_id title').exec();
    post.topics = topics;

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_post_detail')({
                users,
                posts: [post],
                audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id)),
                comments
            })
        ]
    }
}
