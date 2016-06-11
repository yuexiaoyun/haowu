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
    console.log(userInfo);
    var doc = yield User.findOne({unionid: userInfo.unionid});
    console.log(doc);
    if (!doc)
        doc = new User();
    Object.assign(doc, userInfo);
    console.log(doc);
    yield doc.save();
    this.session.user_id = doc._id.toString();
    this.session.userInfo = userInfo;
    console.log(this.query.target);
    this.redirect(this.query.target);
}
