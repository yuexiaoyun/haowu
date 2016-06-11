var oauth = require('../utility/wechat').oauth;
var User = require('../mongodb_models/user').Model;

module.exports = function *() {
    var code = this.query.code;
    var userInfo = yield new Promise((resolve, reject) => {
        oauth.getAccessToken(code, (err, result) => {
            if (err)
                reject(err);
            else {
                var accessToken = result.data.access_token;
                var openid = result.data.openid;
                oauth.getUser(openid, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve({
                            openid: openid,
                            ...result
                        });
                });
            }
        });
    });
    var doc = yield User.findOne({unionid: userInfo.unionid});
    if (!doc) {
        doc = new User();
        doc.status = 1;
    }
    Object.assign(doc, userInfo);
    yield doc.save();
    this.session.user_id = doc._id.toString();
    this.session.userInfo = userInfo;
    console.log('redirect to:' + this.query.target);
    this.redirect(this.query.target);
}
