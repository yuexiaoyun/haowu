var router = require('koa-router')();

// TODO: 前后端一致的：发主贴、发评论、发回复的合法性检查
// TODO: 各种发布的hash去重
router.get('/update_post_like_uids', require('./update_post_like_uids'));
router.get('/update_audio_read_uids', require('./update_audio_read_uids'));
router.get('/update_badge', require('./update_badge'));
router.get('/pub_post', require('./pub_post'));
router.get('/sub', require('./sub'));
router.get('/unsub', require('./unsub'));
router.get('/update_feeds', require('./update_feeds'));
router.get('/update_user_detail', require('./update_user_detail'));
router.get('/update_post_detail', require('./update_post_detail'));
router.get('/read', require('./read'));
router.get('/delete_post', require('./delete_post'));
router.get('/update_notifications', require('./update_notifications'));
router.get('/set_intro', require('./set_intro'));
router.get('/set_title', require('./set_title'));
router.get('/like', require('./like'));
router.get('/pub_reply', require('./pub_reply'));
router.get('/pub_comment', require('./pub_comment'));
/*
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
*/
module.exports = router.routes();
