var router = require('koa-router')();
var conf = require('../conf');

var User = require('../mongodb_models/user').Model;
var Post = require('../mongodb_models/post').Model;
var Comment = require('../mongodb_models/comment').Model;
var Notification = require('../mongodb_models/notification').Model;
var Badge = require('../models/Badge');
var Feed = require('../models/Feed');

var qiniu = require('../utility/qiniu');
var wechat = require('../utility/wechat').api;
var mongoose = require('mongoose');

import _ from 'underscore'
import {createAction} from 'redux-actions'

// TODO: 前后端一致的：发主贴、发评论、发回复的合法性检查

router.get('/update_feeds', function *() {
    this.body = {
        result: 'ok',
        actions: yield Feed.load(this.session.openid, this.query.beforeid)
    };
    console.log(JSON.stringify(this.body.actions));
});
router.get('/delete_post', function *() {
    this.body = {
        result: 'ok',
        actions: yield Feed.deletePost(this.session.openid, this.query._id)
    };
    console.log(JSON.stringify(this.body.actions));
});
router.get('/update_user_detail', function *() {
    this.body = {
        result: 'ok',
        actions: yield Feed.loadByUser(this.session.openid, this.query.openid)
    };
    console.log(JSON.stringify(this.body.actions[1]));
});
router.get('/update_post_detail', function *() {
    this.body = {
        result: 'ok',
        actions: yield Feed.loadPostDetail(this.session.openid, this.query._id)
    };
    console.log(JSON.stringify(this.body.actions));
});
router.get('/like', function *() {
    var q = { _id: this.query._id, status: {$ne: 0} };
    var d = {
        $addToSet: {
            likes: this.session.openid
        }
    };
    var update = yield Post.update(q, d);
    console.log(update);
    if (update.nModified > 0) {
        var doc = yield Post.findOne({_id: this.query._id}).select('openid').exec();
        // TODO: 自己给自己点赞不发通知
        yield wechat.sendTemplate(
            doc.openid,
            'FRTOKz43duOUsJI2BQdQGSd4qpl0r7g0RvEJewx5zkA',
            conf.site + '/app/post/' + this.query._id,
            '#FF0000', {
                first: {
                    value: this.session.userInfo.nickname,
                    color: "#173177"
                }
            });
        var query = {
            openid: doc.openid,
            openid2: this.session.openid,
            type: 'like',
            target: this.query._id
        }
        console.log(yield Notification.update(query, {
            ...query,
            uptime: new Date()
        }, { upsert: true }));
    }
    this.body = yield {
        result: 'ok',
        update
    };
});
router.get('/read', function *() {
    var q = { _id: this.query._id };
    var d = {
        $addToSet: {
            reads: this.session.openid
        }
    };
    this.body = yield {
        result: 'ok',
        update: Post.update(q, d)
    };
});

router.get('/pub_post', function *() {
    console.log('here');
    var post = new Post();
    Object.assign(post, this.query);
    post.openid = this.session.openid;
    yield [
        qiniu.sync(post.audio_id),
        qiniu.sync(post.pic_id)
    ];
    yield qiniu.pfop(post.audio_id);
    var info = JSON.parse(yield qiniu.stat(post.pic_id));
    post.w = info.width;
    post.h = info.height;
    post.status = 1;
    yield post.save();
    this.body = {
        result: 'ok',
        actions: [
            createAction('feed_ids')([]),
            createAction('user_post_ids')(_.object([this.session.openid],[[]]))
        ]
    };
});

router.get('/pub_comment', function *() {
    // 获取原贴信息（主要看原贴是否已删除，以及是否是贴主自己在评论）
    var post = yield Post.findOne({
        _id: this.query.post_id,
        status: {$ne: 0}
    }).select('openid').exec();

    if (!post)
        this.throw(404);

    // 开始生成这一条评论。注意只有楼主才能用语音评论
    var comment = new Comment();
    Object.assign(comment, this.query);
    comment.openid = this.session.openid;
    if (post.openid != this.session.openid)
        comment.audio_id = null;
    if (comment.audio_id) {
        yield qiniu.sync(comment.audio_id),
        yield qiniu.pfop(comment.audio_id);
    }
    comment.status = 1;
    comment.uptime = new Date();
    yield comment.save();

    // 发送站内通知
    var notification = new Notification();
    notification.openid = post.openid;
    notification.openid2 = this.session.openid;
    notification.type = 'comment';
    notification.target = this.query.post_id;
    notification.comment_id = comment._id;
    notification.audio_id = comment.audio_id;
    notification.text = comment.text;
    notification.uptime = new Date();
    yield notification.save();

    // 发送公众号通知
    // TODO: 把几处发公众号通知的地方，放到一个文件中
    yield wechat.sendTemplate(
        post.openid,
        'jGs_WM8l95bgGzyeBnQfphxM0rxEiEkUau3VV3r51wM',
        conf.site + '/app/post/' + this.query.post_id + '/comments/' + comment._id,
        '#FF0000', {
            first: {
                value: this.session.userInfo.nickname,
                color: "#173177"
            },
            second: {
                value: comment.audio_id ? '[语音]' : comment.text,
                color: "#000000"
            }
        });

    this.body = {
        result: 'ok',
        actions: [
            createAction('new_comment')(comment)
        ]
    };
    console.log(this.body);
});

router.get('/fetch_post_detail', function *() {
    var post = yield Post.findOne({
        _id: this.query._id
    }).exec();
    var like_users = yield User.find({
        openid: { $in: post.likes }
    }).exec();
    this.body = { result: 'ok', post, like_users };
    console.log(this.body);
});

router.get('/update_me', function *() {
    this.body = {
        result: 'ok',
        actions: yield Feed.loadMe(this.session.openid)
    };
    console.log(JSON.stringify(this.body.actions));
});

router.get('/clear_badge', function *() {
    var clear = yield new Badge(this.session.openid).clear();
    console.log(clear);
    this.body = { result: 'ok', clear: clear };
});

router.get('/sub', function *() {
    var q = { openid: this.query.openid };
    var d = {
        $addToSet: {
            subids: this.session.openid
        }
    };
    var update = yield User.update(q, d);
    console.log(update);
    if (update.nModified > 0) {
        yield wechat.sendTemplate(
            this.query.openid,
            '3JFrw9e6GFGUKjAHBWZCvSYyKl9u-JGIf7Idn5VSolU',
            conf.site + '/app/me/notifications',
            '#FF0000', {
                first: {
                    value: this.session.userInfo.nickname,
                    color: "#173177"
                }
            });
        var query = {
            openid: this.query.openid,
            openid2: this.session.openid,
            type: 'sub'
        }
        console.log(yield Notification.update(query, {
            ...query,
            uptime: new Date()
        }, { upsert: true }));
    }
    var user = yield User.findOne(q).select('openid headimgurl nickname subids').exec();
    var users = _.object([user.openid], [User.toBrowser(user, this.session.openid)])
    this.body = yield {
        result: 'ok',
        actions: [createAction('users')(users)]
    };
});

router.get('/unsub', function *() {
    var q = { openid: this.query.openid };
    var d = {
        $pull: {
            subids: this.session.openid
        }
    };
    var update = yield User.update(q, d);
    var user = yield User.findOne(q).select('openid headimgurl nickname subids').exec();
    var users = _.object([user.openid], [User.toBrowser(user, this.session.openid)])
    this.body = yield {
        result: 'ok',
        actions: [createAction('users')(users)]
    };
    console.log(JSON.stringify(this.body));
});


module.exports = router.routes();
