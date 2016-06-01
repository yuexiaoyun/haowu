var router = require('koa-router')();

var User = require('../mongodb_models/user').Model;
var Post = require('../mongodb_models/post').Model;

var qiniu = require('../utility/qiniu');

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
        user: User.findOne({openid: this.session.openid}).exec()
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

router.get('/fetch_posts', function *() {
    var ps = yield Post.find().sort({_id: -1}).exec();
    var posts = [];
    for (var post of ps) {
        var user = yield User.findOne({
            openid: post.openid
        }).exec();
        post = post.toObject();
        post.user = user;
        posts.push(post);
    }
    console.log(posts);
    this.body = { result: 'ok', posts: posts };
});

module.exports = router.routes();
