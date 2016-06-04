var router = require('koa-router')();
var conf = require('../conf');

var User = require('../mongodb_models/user').Model;
var Post = require('../mongodb_models/post').Model;
var Notification = require('../mongodb_models/notification').Model;
var Badge = require('../models/Badge');

var qiniu = require('../utility/qiniu');
var wechat = require('../utility/wechat').api;
var mongoose = require('mongoose');

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
    yield post.save();
    this.body = { result: 'ok', post: post };
});

router.get('/fetch_post', function *() {
    var post = yield Post.findOne({
        _id: this.query._id
    }).exec();
    var user = yield User.findOne({
        openid: post.openid
    }).exec();
    this.body = { result: 'ok', post: post, user: user };
});

router.get('/fetch_me', function *() {
    this.body = yield {
        result: 'ok',
        posts: Post.find({openid: this.session.openid}).sort({_id: -1}).exec(),
        notifications: new Badge(this.session.openid).list()
    };
});

router.get('/fetch_detail', function *() {
    this.body = yield {
        result: 'ok',
        posts: Post.find({openid: this.query.openid}).sort({_id: -1}).exec(),
        user: User.findOne({openid: this.query.openid}).exec()
    };
    console.log(this.body);
});

router.get('/fetch_subs', function *() {
    var user = yield User.findOne({openid: this.session.openid}).select('subids').exec();
    var subids = user.subids || [];
    this.body = yield {
        result: 'ok',
        users: yield User.find({openid: {$in: subids}}).select('openid headimgurl nickname').exec()
    };
    console.log(this.body);
});

router.get('/fetch_posts', function *() {
    var q = this.query.beforeid ? {
        _id: { $lt: this.query.beforeid }
    } : {};
    var ps = yield Post.find(q).sort({_id: -1}).limit(50).exec();
    var posts = [];
    for (var post of ps) {
        var user = yield User.findOne({
            openid: post.openid
        }).exec();
        post = post.toObject();
        post.user = user;
        posts.push(post);
    }
    console.log(posts.length);
    this.body = { result: 'ok', posts: posts };
});

router.get('/like', function *() {
    var q = { _id: this.query._id };
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
            conf.site + '/app/home',
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
            conf.site + '/app/home',
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
    this.body = yield {
        result: 'ok',
        update
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

module.exports = router.routes();
