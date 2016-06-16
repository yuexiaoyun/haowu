var router = require('koa-router')();
var conf = require('../../conf');
var debug = require('debug')('app');

var User = require('../../mongodb_models/user').Model;
var Post = require('../../mongodb_models/post').Model;
var Comment = require('../../mongodb_models/comment').Model;
var Audio = require('../../mongodb_models/audio').Model;
var Notification = require('../../mongodb_models/notification').Model;
var Badge = require('../../models/Badge');
var Feed = require('../../models/Feed');

var qiniu = require('../../utility/qiniu');
var wechat = require('../../utility/wechat').api;
var mongoose = require('mongoose');
var { notifyLike, notifyComment, notifyReply, notifySub, notifyPub } = require('../../utility/msg');

import _ from 'underscore'
import {createAction} from 'redux-actions'

// TODO: 前后端一致的：发主贴、发评论、发回复的合法性检查
// TODO: 各种发布的hash去重
// TODO: 防CSRF攻击处理

router.get('/update_post_like_uids', require('./update_post_like_uids'));
router.get('/update_audio_read_uids', require('./update_audio_read_uids'));
router.get('/pub_post', require('./pub_post'));
router.get('/sub', require('./sub'));
router.get('/unsub', require('./unsub'));
router.get('/update_feeds', require('./update_feeds'));
router.get('/update_user_detail', require('./update_user_detail'));

router.get('/delete_post', function *() {
    this.body = {
        result: 'ok',
        actions: yield Feed.deletePost(this.session.user_id, this.query._id)
    };
    debug(JSON.stringify(this.body.actions));
});

router.get('/update_post_detail', function *() {
    this.body = {
        result: 'ok',
        actions: yield Feed.loadPostDetail(this.session.user_id, this.query._id)
    };
    debug(JSON.stringify(this.body.actions));
});
router.get('/like', function *() {
    var q = { _id: this.query._id, status: {$ne: 0} };
    var d = {
        $addToSet: {
            likes: this.session.user_id
        }
    };
    var update = yield Post.update(q, d);
    console.log(update);
    if (update.nModified > 0) {
        var doc = yield Post.findOne({_id: this.query._id}).select('user_id').exec();
        if (doc.user_id != this.session.user_id) {
            console.log(yield notifyLike(this.session, doc));
            var query = {
                user_id: doc.user_id,
                user_id2: this.session.user_id,
                type: 'like',
                target: this.query._id
            }
            console.log(yield Notification.update(query, {
                ...query,
                uptime: new Date()
            }, { upsert: true }));
        }
    }
    this.body = yield {
        result: 'ok',
        update
    };
});

router.get('/pub_reply', function *() {
    // 获取原评论信息，注意在被删除的评论下面仍然能接着回复，所以没有status=1的限制
    var comment = yield Comment.findOne({
        _id: this.query.comment_id
    }).exec();
    if (!comment)
        this.throw(404);

    // 获取原贴信息（主要看原贴是否已删除，以及是否是贴主自己在评论）
    var post = yield Post.findOne({
        _id: comment.post_id,
        status: {$ne: 0}
    }).select('user_id').exec();
    if (!post)
        this.throw(404);

    // 检查回复的人确实在评论或者回复里
    var user_ids = [comment.user_id, ...comment.replies.map((reply)=>reply.user_id)];
    if (user_ids.indexOf(this.query.user_id) < 0)
        this.throw(404);

    // 保存回复
    // TODO: 竞态条件下comment.save()会失败
    var reply = {
        user_id: this.session.user_id,
        user_id2: this.query.user_id,
        text: this.query.text,
        audio_id: this.query.audio_id,
        d: this.query.d
    }
    if (this.session.user_id != post.user_id) {
        delete reply.audio_id;
        delete reply.d;
    }
    if (reply.audio_id) {
        yield qiniu.sync(reply.audio_id),
        yield qiniu.pfop(reply.audio_id);
    }
    comment.uptime = new Date();
    comment.replies.push(reply);
    yield comment.save();
    reply = comment.replies[comment.replies.length - 1];

    // 发送站内通知
    var notification = new Notification();
    notification.user_id = reply.user_id2;
    notification.user_id2 = reply.user_id;
    notification.type = 'reply';
    notification.target = comment.post_id;
    notification.comment_id = comment._id;
    notification.reply_id = reply._id;
    notification.audio_id = reply.audio_id;
    notification.d = reply.d;
    notification.text = reply.text;
    notification.uptime = new Date();
    yield notification.save();
    console.log(yield notifyReply(this.session, comment, reply));

    this.body = {
        result: 'ok',
        new_id: reply._id,
        actions: [
            createAction('update_comment')(comment)
        ]
    };
    console.log(this.body);
})

router.get('/pub_comment', function *() {
    // 获取原贴信息（主要看原贴是否已删除，以及是否是贴主自己在评论）
    var post = yield Post.findOne({
        _id: this.query.post_id,
        status: {$ne: 0}
    }).select('user_id').exec();

    if (!post)
        this.throw(404);

    // 开始生成这一条评论。注意只有物主才能用语音评论
    var comment = new Comment();
    Object.assign(comment, this.query);
    comment.user_id = this.session.user_id;
    if (post.user_id != this.session.user_id) {
        comment.audio_id = null;
        comment.d = null;
    }
    if (comment.audio_id) {
        yield qiniu.sync(comment.audio_id),
        yield qiniu.pfop(comment.audio_id);
    }
    comment.status = 1;
    comment.uptime = new Date();
    yield comment.save();

    // 发送站内通知
    if (this.session.user_id != post.user_id) {
        var notification = new Notification();
        notification.user_id = post.user_id;
        notification.user_id2 = this.session.user_id;
        notification.type = 'comment';
        notification.target = this.query.post_id;
        notification.comment_id = comment._id;
        notification.audio_id = comment.audio_id;
        notification.d = comment.d;
        notification.text = comment.text;
        notification.uptime = new Date();
        yield notification.save();

        // 发送公众号通知
        console.log(yield notifyComment(this.session, post, comment));
    }
    this.body = {
        result: 'ok',
        new_id: comment._id,
        actions: [
            createAction('update_comment')(comment)
        ]
    };
    console.log(this.body);
});

router.get('/delete_comment', function *() {
    // 获取原评论信息
    var q = {
        _id: this.query._id,
        user_id: this.session.user_id,
        status: 1
    };
    var d = {
        $set: {
            status: 0
        }
    };
    var comment = yield Comment.findOneAndUpdate(q, d, { new: true });
    if (!comment)
        this.throw(404);
    yield Notification.remove({
        type: 'comment',
        comment_id: this.query._id
    }).exec();
    this.body = {
        result: 'ok',
        new_id: comment._id,
        actions: [
            createAction('update_comment')(comment)
        ]
    };
    console.log(JSON.stringify(this.body));
});


router.get('/delete_reply', function *() {
    // 获取原评论信息
    var q = {
        'replies._id': this.query._id,
        status: 1
    };
    var d = {
        $pull: {
            replies: {
                _id: this.query._id,
                user_id: this.session.user_id
            }
        }
    };
    var comment = yield Comment.findOneAndUpdate(q, d, { new: true });
    if (!comment)
        this.throw(404);

    yield Notification.remove({
        type: 'reply',
        reply_id: this.query._id
    }).exec();

    this.body = {
        result: 'ok',
        new_id: comment._id,
        actions: [
            createAction('update_comment')(comment)
        ]
    };
    console.log(JSON.stringify(this.body));
});

router.get('/update_me', function *() {
    this.body = {
        result: 'ok',
        actions: yield Feed.loadMe(this.session.user_id)
    };
    console.log(JSON.stringify(this.body.actions));
});

router.get('/clear_badge', function *() {
    var clear = yield new Badge(this.session.user_id).clear();
    console.log(clear);
    this.body = { result: 'ok', clear: clear };
});

router.get('/read', function *() {
    var q = { audio_id: this.query.audio_id };
    var d = {
        $addToSet: {
            reads: this.session.user_id
        }
    };
    var update = yield Audio.update(q, d, {upsert: true});
    this.body = yield {
        result: 'ok'
    };
    console.log(JSON.stringify(this.body));
});

module.exports = router.routes();
