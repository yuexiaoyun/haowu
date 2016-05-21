var router = require('koa-router')();

var User = require('../mongodb_models/user').Model;
var Post = require('../mongodb_models/post').Model;

router.get('/pub_post', function *() {
    console.log('here');
    var post = new Post();
    Object.assign(post, this.query);
    post.openid = this.session.openid;
    yield post.save();
    this.body = { result: 'ok', post: post };
});

router.get('/fetch_post', function *() {
    console.log('here');
    var post = yield Post.findOne({
        _id: this.query._id
    }).exec();
    var user = yield User.findOne({
        openid: post.openid
    }).exec();
    this.body = { result: 'ok', post: post, user: user };
});

module.exports = router.routes();
