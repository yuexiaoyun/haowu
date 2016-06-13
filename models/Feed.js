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
    static async load(user_id, beforeid) {
        // 获取原始的Post列表 status=2的Post仅作者本人可见
        var q = {
            $or: [
                { status: 1 },
                { status: 2, user_id: user_id}
            ]
        }
        if (beforeid)
            q = { ...q, _id: {$lt: beforeid} }
        var posts = await Post.find(q).sort({_id:-1}).limit(21).exec();
        var feed_end = 1;
        if (posts.length == 21) {
            feed_end = 0;
            posts = _.first(posts, 20);
        }

        // 获取Post的作者信息
        var user_ids = _.uniq(posts.map(post => post.user_id))
        var users = await User.find({
            _id: { $in: user_ids }
        }).select('_id headimgurl nickname subids status').exec()
        user_ids = users.map(user => user._id)
        var user_map = _.object(user_ids, users.map(user=>User.toBrowser(user, user_id)));

        // 作者status != 1则仅作者本人可见
        posts = _.filter(posts, (post) => (user_map[post.user_id].status == 1 || post.user_id == user_id));
        var postids = posts.map((post) => post._id);

        // 获取所有语音是否已听
        var audio_ids = posts.map(post => post.audio_id);
        var docs = await Audio.find({
            audio_id: { $in: audio_ids },
            reads: user_id
        }).select('audio_id').exec();
        var reads = docs.map(doc=>doc.audio_id);

        return [
            createAction('users')(user_map),
            createAction('posts')(_.object(postids, posts.map(post=>Post.toBrowser(post, user_id)))),
            createAction('feed_end')(feed_end),
            createAction('reads')(reads),
            createAction(beforeid ? 'feed_ids_more' : 'feed_ids')(postids)
        ]
    }
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

        // 获取原贴、评论、回复中出现的语音是否已读
        var comment_audio_ids = comments.map(comment => comment.audio_id);
        var reply_audio_ids = replies.map(reply => reply.audio_id);
        var audio_ids = _.uniq(_.compact([
            post.audio_id,
            ...comment_audio_ids,
            ...reply_audio_ids
        ]));
        console.log(audio_ids);
        var docs = await Audio.find({
            audio_id: { $in: audio_ids },
            reads: user_id
        }).select('audio_id').exec();
        var reads = docs.map(doc=>doc.audio_id);

        var me_read = reads.indexOf(user_id) >= 0;
        var audio = await Audio.findOne({
            audio_id: post.audio_id
        }).exec();
        var others_read_count = audio ? (audio.reads.length - me_read ? 1 : 0) : 0;

        return [
            createAction('users')(_.object(user_ids, users.map(user=>User.toBrowser(user, user_id)))),
            createAction('posts')(_.object([_id], [Post.toBrowser(post, user_id)])),
            createAction('post_details')(_.object([_id], [{
                comments: comments,
                others_read_count: others_read_count
            }])),
            createAction('reads')(reads)
        ]
    }
    static async loadByUser(user_id, user_id2) {
        // TODO: 一个人的发布列表要支持分页？
        var posts = await Post.find({user_id:user_id2, status: {$ne: 0}}).sort({_id:-1}).exec()
        var postids = posts.map(post => post._id)
        return [
            createAction('posts')(_.object(postids, posts.map(post=>Post.toBrowser(post, user_id)))),
            createAction('user_post_ids')(_.object([user_id2], [postids]))
        ]
    }
    static async loadMe(user_id) {
        // TODO: subids和notifications要支持分页？
        var results = await Promise.all([
            Feed.loadByUser(user_id, user_id),
            User.findOne({_id: user_id}).select('subids clear_badge').exec(),
            new Badge(user_id).list()
        ])
        var user_ids = _.uniq([
            user_id,
            ...(results[1].subids || []),
            ...(results[2].map(result=>result.user_id2))
        ]);
        var users = await User.find({
            _id: { $in: user_ids }
        }).select('_id headimgurl nickname subids status').exec()
        user_ids = users.map(user => user._id)

        // 互动区的所有语音
        var audio_ids = results[2].map(notification=>notification.audio_id);
        audio_ids = _.compact(audio_ids);
        var docs = await Audio.find({
            audio_id: { $in: audio_ids },
            reads: user_id
        }).select('audio_id').exec();
        var reads = docs.map(doc=>doc.audio_id);

        return [
            createAction('users')(_.object(user_ids, users.map(user=>User.toBrowser(user, user_id)))),
            createAction('clear_badge_time')(results[1].clear_badge || null),
            createAction('reads')(reads),
            createAction('notifications')(results[2]),
            createAction('subids')(results[1].subids),
            ...results[0]
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
