import {createAction} from 'redux-actions'
import {Model as Post} from '../mongodb_models/post'
import {Model as User} from '../mongodb_models/user'
import {Model as Notification} from '../mongodb_models/notification'
import {Model as Comment} from '../mongodb_models/comment'
import {Model as Audio} from '../mongodb_models/audio'
import createError from 'http-errors'
import Badge from './Badge'
import _ from 'underscore'

export default class Feed {
    // TODO: 点赞列表和评论、评论回复的分页
    static async loadPostDetail(user_id, _id) {
        // 获取原始Post
        var post = await Post.findOne({_id:_id, status: {$ne: 0}}).exec();
        if (!post)
            throw(createError(404));

        // 获取评论、回复和所有评论、回复、点赞中出现的user_id对应的用户
        var comments = await Comment.find({post_id: _id}).sort({_id: -1}).exec();
        var comment_user_ids = comments.map((comment)=>comment.user_id);
        var replies = _.flatten(comments.map((comment)=>comment.replies));
        var reply_uids = replies.map((reply)=>reply.user_id);
        var users = await User.find({_id: {
            $in: _.uniq([
                post.user_id,
                ...comment_user_ids,
                ...reply_uids
            ])
        }}).exec();
        var user_ids = users.map(user=>user._id);

        // TODO: 获取原贴、评论、回复中出现的语音是否已读
        var comment_audio_ids = comments.map(comment => comment.audio_id);
        var reply_audio_ids = replies.map(reply => reply.audio_id);
        var audio_ids = _.uniq(_.compact([
            post.audio_id,
            ...comment_audio_ids,
            ...reply_audio_ids
        ]));

        return [
            createAction('users')(_.object(user_ids, users.map(user=>User.toBrowser(user, user_id)))),
            createAction('posts')(_.object([_id], [Post.toBrowser(post, user_id)])),
            createAction('post_details')(_.object([_id], [{
                comments: comments
            }]))
        ]
    }
    static async loadMe(user_id) {
        // TODO: subids和notifications要支持分页？
        var results = await Promise.all([
            User.findOne({_id: user_id}).select('subids clear_badge').exec(),
            new Badge(user_id).list()
        ])
        var user_ids = _.uniq([
            user_id,
            ...(results[0].subids || []),
            ...(results[1].map(result=>result.user_id2))
        ]);
        var users = await User.find({
            _id: { $in: user_ids }
        }).select('_id headimgurl nickname subids status').exec()
        user_ids = users.map(user => user._id)

        // TODO: 互动区所有语音的已读未读
        return [
            createAction('users')(_.object(user_ids, users.map(user=>User.toBrowser(user, user_id)))),
            createAction('clear_badge_time')(results[0].clear_badge || null),
            createAction('notifications')(results[1]),
            createAction('subids')(results[0].subids)
        ]
    }
    static async deletePost(user_id, _id) {
        var q = { _id:_id, user_id:user_id, status: {$ne: 0} };
        var d = {
            status: 0
        };
        var update = await Post.update(q, d);
        if (update.nModified > 0) {
            var q = { target: _id };
            await Notification.remove(q).exec();
            return [
                createAction('delete_my_post')(_id),
                createAction('posts')(_.object([_id],[null]))
            ];
        } else {
            return [];
        }
    }
}
