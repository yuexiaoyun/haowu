var router = require('koa-router')();
router.get('/qr_code', require('./qr_code'));
router.get('/notify_mark', require('./notify_mark'));
export default module.exports = router.routes();
