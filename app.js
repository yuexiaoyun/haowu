var koa = require('koa');
var serve = require('koa-static');
var mount = require('koa-mount');
var logger = require('koa-log');
var conf = require('./conf');
var app = koa();
require('koa-qs')(app);

var oauth = require('./utility/wechat').oauth;
var url = oauth.getAuthorizeURL(conf.site + '/login', 'state', 'snsapi_userinfo');
console.log(url);
app.use(mount('/login', function *() {
    var code = this.query.code;
    this.body = yield new Promise(function(resolve, reject) {
        oauth.getAccessToken(code, function (err, result) {
            if (err)
                reject(err);
            else {
                var accessToken = result.data.access_token;
                var openid = result.data.openid;
                oauth.getUser(openid, function (err, result) {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                });
            }
        });
    });
}));
app.use(mount('/static', serve('static')));
app.use(function *() {
    this.body = this.query.echostr;
});
app.listen(8080);
