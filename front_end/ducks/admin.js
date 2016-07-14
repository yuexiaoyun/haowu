var conf = require('../conf');
var path = require('path');
var co = require('co');
var UserInfo = require('../mongodb_models/user_info').Model;

module.exports = function *() {
    if (this.session.u > 0) {
        var user = yield UserInfo.findById(this.session.u).select('is_admin').exec();
        if (!user || !user.is_admin) {
            this.throw(403);
        }
        this.render('admin', {
            u: this.session.u
        });
    } else {
        this.redirect('https://maimai.cn/oauth_login?appid=25100000&login=1');
    }
}
