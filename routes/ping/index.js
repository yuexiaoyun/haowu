var router = require('koa-router')();
router.get('/feed', require('./feed'));
module.exports = router.routes();
