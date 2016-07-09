var koa = require('koa');
var serve = require('koa-static');
var mount = require('koa-mount');
var logger = require('koa-logger');
var conf = require('./conf');
var path = require('path');
var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo');
var oauth = require('./utility/wechat').oauth;
var qs = require('querystring');
var co = require('co');
var ms = require('ms');
var gzip = require('koa-gzip');
var wechat = require('co-wechat');
var Jade = require('koa-jade');
var fs = require('fs');

require('babel-polyfill');
require('babel-register')();

var app = koa();
require('koa-qs')(app);
var assets = fs.readFileSync('./front_end/templates/webpack-assets.json');
assets = JSON.parse(assets.toString());
console.log(assets);
var jade = new Jade({
    viewPath: './front_end/templates',
    locals: {
        js_file: assets.main.js
    },
    debug: false,
    pretty: false,
    compileDebug: false,
    app: app // equals to jade.use(app) and app.use(jade.middleware)
})
app.keys = [conf.secret];
app.use(mount('/internal', require('./routes/internal')));
app.use(session({
    store: new MongoStore({
        url: conf.mongodb
    })
}));
app.use(logger());
// TODO：云主机上不能用ROOT运行

app.use(gzip());
app.use(mount('/agent', wechat(conf.wechat_token).middleware(require('./routes/agent'))));
if (conf.debug)
    app.use(mount('/internal_login', require('./routes/internal_login')));
app.use(mount('/login', require('./routes/login')));
app.use(mount('/static', serve('static', {maxAge: ms('10y')})));
app.use(function *(next) {
    if (!this.session.user_id) {
        var origin = conf.site + '/login?' + qs.stringify({
            target: this.originalUrl,
            host: this.host
        });
        var url = oauth.getAuthorizeURL(origin, 'state', 'snsapi_userinfo');
        this.redirect(url);
    } else {
        yield *next;
    }
});
app.use(mount('/app', require('./routes/app')));
app.use(mount('/api', require('./routes/api')));
app.use(mount('/ping', require('./routes/ping')));
app.listen(conf.port || 8080);
