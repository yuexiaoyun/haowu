var koa = require('koa');
var serve = require('koa-static');
var mount = require('koa-mount');
var logger = require('koa-log');
var conf = require('./conf');
var app = koa();
var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo');
var oauth = require('./utility/wechat').oauth;
var qs = require('querystring');

require('koa-qs')(app);
require('babel-core/register')();

app.keys = [conf.secret];
app.use(session({
    store: new MongoStore({
        url: conf.mongodb
    })
}));
app.use(mount('/login', require('./routes/login')));
app.use(function *(next) {
    if (!this.session.openid) {
        var origin = conf.site + '/login?' + qs.stringify({
            target: this.url
        });
        console.log(origin);
        var url = oauth.getAuthorizeURL(origin, 'state', 'snsapi_userinfo');
        this.redirect(url);
    } else {
        console.log(this.session.openid);
        yield *next;
    }
});
app.use(mount('/static', serve('static')));
app.use(function *() {
    this.body = this.query.echostr;
});
app.listen(8080);
