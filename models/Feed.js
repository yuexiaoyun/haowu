import {createAction} from 'redux-actions'
import {Model as Post} from '../mongodb_models/post'
import {Model as User} from '../mongodb_models/user'
import {Model as Notification} from '../mongodb_models/notification'
import {Model as Comment} from '../mongodb_models/comment'
import createError from 'http-errors'
import Badge from './Badge'
import _ from 'underscore'

export default class Feed {
    static async load(user_id, beforeid) {
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
        console.log(posts.length);
        if (posts.length == 21) {
            feed_end = 0;
            posts = _.first(posts, 20);
        }
        var postids = posts.map(post => post._id)
        var user_ids = _.uniq(posts.map(post => post.user_id))
        var users = await User.find({
            _id: { $in: user_ids }
        }).select('_id headimgurl nickname subids status').exec()
        user_ids = users.map(user => user._id)

        var user_map = _.object(user_ids, users.map(user=>User.toBrowser(user, user_id)));
        console.log(user_map);
        console.log(user_id);
        var postids = _.chain(posts)
            .filter((post) => (user_map[post.user_id].status == 1 || post.user_id == user_id))
            .map((post) => post._id)
            .value();
        console.log(postids);
        return [
            createAction('users')(user_map),
            createAction('posts')(_.object(postids, posts.map(post=>Post.toBrowser(post, user_id)))),
            createAction('feed_end')(feed_end),
            createAction(beforeid ? 'feed_ids_more' : 'feed_ids')(postids)
        ]
    }
    // TODO: 点赞列表和评论、评论回复的分页
    static async loadPostDetail(user_id, _id) {
        var post = await Post.findOne({_id:_id, status: {$ne: 0}}).exec();
        if (!post)
            throw(createError(404));
        var comments = await Comment.find({post_id: _id, status: 1}).sort({_id:1}).exec();
        var comment_user_ids = comments.map((comment)=>comment.user_id);
        var replies = _.flatten(comments.map((comment)=>comment.replies));
        var reply_uids = replies.map((reply)=>reply.user_id);
        var likes = post.likes || [];
        var users = await User.find({_id: {
            $in: _.uniq([
                post.user_id,
                ...likes,
                ...comment_user_ids,
                ...reply_uids
            ])
        }}).exec();
        var user_ids = users.map(user=>user._id);
        return  [
            createAction('users')(_.object(user_ids, users.map(user=>User.toBrowser(user, user_id)))),
            createAction('posts')(_.object([_id], [Post.toBrowser(post, user_id)])),
            createAction('post_details')(_.object([_id], [{
                likes: post.likes,
                comments: comments
            }]))
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
        return [
            createAction('users')(_.object(user_ids, users.map(user=>User.toBrowser(user, user_id)))),
            createAction('clear_badge_time')(results[1].clear_badge || null),
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
