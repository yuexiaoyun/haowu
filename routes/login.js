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
                        resolve(result);
                });
            }
        });
    });
    var doc = yield User.findOne({openid: userInfo.openId});
    if (!doc)
        doc = new User();
    Object.assign(doc, userInfo);
    yield doc.save();
    this.body = userInfo;
}
