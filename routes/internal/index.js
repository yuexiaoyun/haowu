var router = require('koa-router')();
router.get('/qr_code', require('./qr_code'));
export default module.exports = router.routes();
