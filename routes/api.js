var router = require('koa-router')();

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
    this.body = { result: 'ok', post: post };
});

module.exports = router.routes();
