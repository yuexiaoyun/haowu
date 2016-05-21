var router = require('koa-router')();

var Post = require('../mongodb_models/post').Model;

router.get('/post', function *() {
    console.log('here');
    var post = new Post();
    Object.assign(post, this.query);
    yield post.save();
    this.body = { result: 'ok' };
});

module.exports = router.routes();
