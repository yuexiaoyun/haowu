import {createAction} from 'redux-actions'
import {Model as Post} from '../mongodb_models/post'
import {Model as User} from '../mongodb_models/user'
import {Model as Notification} from '../mongodb_models/notification'
import {Model as Comment} from '../mongodb_models/comment'
import createError from 'http-errors'
import Badge from './Badge'
import _ from 'underscore'

export default class Feed {
    static async load(openid, beforeid) {
        var q = {
            $or: [
                { status: 1 },
                { status: 2, openid: openid}
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
        var postids = posts.map(post => post._id)
        var openids = _.uniq(posts.map(post => post.openid))
        var users = await User.find({
            openid: { $in: openids }
        }).select('openid headimgurl nickname subids status').exec()
        openids = users.map(user => user.openid)

        var user_map = _.object(openids, users.map(user=>User.toBrowser(user, openid)));
        console.log(openid);
        var postids = _.chain(posts)
            .filter((post) => (user_map[post.openid].status == 1 || post.openid == openid))
            .map((post) => post._id)
            .value();
        return [
            createAction('users')(user_map),
            createAction('posts')(_.object(postids, posts.map(post=>Post.toBrowser(post, openid)))),
            createAction('feed_end')(feed_end),
            createAction(beforeid ? 'feed_ids_more' : 'feed_ids')(postids)
        ]
    }
    // TODO: 点赞列表和评论、评论回复的分页
    static async loadPostDetail(openid, _id) {
        var post = await Post.findOne({_id:_id, status: {$ne: 0}}).exec();
        if (!post)
            throw(createError(404));
        var comments = await Comment.find({post_id: _id, status: 1}).exec();
        var comment_openids = comments.map((comment)=>comment.openid);
        var replies = _.flatten(comments.map((comment)=>comment.replies));
        var reply_uids = replies.map((reply)=>reply.openid);
        var likes = post.likes || [];
        var users = await User.find({openid: {
            $in: _.uniq([
                post.openid,
                ...likes,
                ...comment_openids,
                ...reply_uids
            ])
        }}).exec();
        var openids = users.map(user=>user.openid);
        return  [
            createAction('users')(_.object(openids, users.map(user=>User.toBrowser(user, openid)))),
            createAction('posts')(_.object([_id], [Post.toBrowser(post, openid)])),
            createAction('post_details')(_.object([_id], [{
                likes: post.likes,
                comments: comments
            }]))
        ]
    }
    static async loadByUser(openid, openid2) {
        // TODO: 一个人的发布列表要支持分页？
        var posts = await Post.find({openid:openid2, status: {$ne: 0}}).sort({_id:-1}).exec()
        var postids = posts.map(post => post._id)
        return [
            createAction('posts')(_.object(postids, posts.map(post=>Post.toBrowser(post, openid)))),
            createAction('user_post_ids')(_.object([openid2], [postids]))
        ]
    }
    static async loadMe(openid) {
        // TODO: subids和notifications要支持分页？
        var results = await Promise.all([
            Feed.loadByUser(openid, openid),
            User.findOne({openid: openid}).select('subids clear_badge').exec(),
            new Badge(openid).list()
        ])
        var openids = _.uniq([
            openid,
            ...(results[1].subids || []),
            ...(results[2].map(result=>result.openid2))
        ]);
        var users = await User.find({
            openid: { $in: openids }
        }).select('openid headimgurl nickname subids status').exec()
        openids = users.map(user => user.openid)
        return [
            createAction('users')(_.object(openids, users.map(user=>User.toBrowser(user, openid)))),
            createAction('clear_badge_time')(results[1].clear_badge),
            createAction('notifications')(results[2]),
            createAction('subids')(results[1].subids),
            ...results[0]
        ]
    }
    static async deletePost(openid, _id) {
        var q = { _id:_id, openid:openid, status: {$ne: 0} };
        var d = {
            status: 0
        };
        var update = await Post.update(q, d);
        if (update.nModified > 0) {
            var q = { openid: openid, target: _id };
            await Notification.remove(q);
            return [
                createAction('delete_my_post')(_id),
                createAction('posts')(_.object([_id],[null]))
            ];
        } else {
            return [];
        }
    }
}
