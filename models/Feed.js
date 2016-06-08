import {createAction} from 'redux-actions'
import {Model as Post} from '../mongodb_models/post'
import {Model as User} from '../mongodb_models/user'
import {Model as Notification} from '../mongodb_models/notification'
import createError from 'http-errors'
import Badge from './Badge'
import _ from 'underscore'

export default class Feed {
    static async load(openid, beforeid) {
        var q = { status: 1 }
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
        }).select('openid headimgurl nickname subids').exec()
        openids = users.map(user => user.openid)
        return [
            createAction('users')(_.object(openids, users.map(user=>User.toBrowser(user, openid)))),
            createAction('posts')(_.object(postids, posts.map(post=>Post.toBrowser(post, openid)))),
            createAction('feed_end')(feed_end),
            createAction(beforeid ? 'feed_ids_more' : 'feed_ids')(postids)
        ]
    }
    static async loadPostDetail(openid, _id) {
        var post = await Post.findOne({_id:_id, status:1}).exec();
        if (!post)
            throw(createError(404));
        var likes = post.likes || [];
        var users = await User.find({openid: {
            $in: [...likes, post.openid]
        }}).exec();
        var openids = users.map(user => user.openid);
        return  [
            createAction('users')(_.object(openids, users.map(user=>User.toBrowser(user, openid)))),
            createAction('posts')(_.object([_id], [Post.toBrowser(post, openid)])),
            createAction('post_details')(_.object([_id], [{likes: post.likes}]))
        ]
    }
    static async loadByUser(openid, openid2) {
        var posts = await Post.find({openid:openid2, status:1}).sort({_id:-1}).exec()
        var postids = posts.map(post => post._id)
        return [
            createAction('posts')(_.object(postids, posts.map(post=>Post.toBrowser(post, openid)))),
            createAction('user_post_ids')(_.object([openid2], [postids]))
        ]
    }
    static async loadMe(openid) {
        var results = await Promise.all([
            Feed.loadByUser(openid, openid),
            User.findOne({openid: openid}).select('subids').exec(),
            new Badge(openid).list()
        ])
        var openids = _.uniq([
            openid,
            ...(results[1].subids || []),
            ...(results[2].map(result=>result.openid2))
        ]);
        var users = await User.find({
            openid: { $in: openids }
        }).select('openid headimgurl nickname subids').exec()
        openids = users.map(user => user.openid)
        return [
            createAction('users')(_.object(openids, users.map(user=>User.toBrowser(user, openid)))),
            createAction('notifications')(results[2]),
            createAction('subids')(results[1].subids),
            ...results[0]
        ]
    }
    static async deletePost(openid, _id) {
        var q = { _id:_id, openid:openid, status:1 };
        var d = {
            status: 0
        };
        var update = await Post.update(q, d);
        console.log(update);
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
