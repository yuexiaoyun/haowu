var koa = require('koa');
var serve = require('koa-static');
var mount = require('koa-mount');
var logger = require('koa-logger');
var conf = require('./conf');
var app = koa();
var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo');
var oauth = require('./utility/wechat').oauth;
var qs = require('querystring');
var gzip = require('koa-gzip');
var Jade = require('koa-jade')
var jade = new Jade({
    viewPath: './front_end/templates',
    debug: false,
    pretty: false,
    compileDebug: false,
    app: app // equals to jade.use(app) and app.use(jade.middleware)
})

require('koa-qs')(app);
require('babel/register')({
    stage: 0
});

app.keys = [conf.secret];
app.use(session({
    store: new MongoStore({
        url: conf.mongodb
    })
}));
app.use(logger());
// TODO: 对公众号事件通知的处理
// TODO: 某现成的统计平台
// TODO：云主机上不能用ROOT运行

app.use(gzip());
app.use(mount('/agent', function *() {
    this.body = this.query.echostr;
}));
app.use(mount('/internal_login', require('./routes/internal_login')));
app.use(mount('/login', require('./routes/login')));
app.use(mount('/static', serve('static')));
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
app.listen(conf.port || 80);
