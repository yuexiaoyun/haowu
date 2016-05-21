var koa = require('koa');
var serve = require('koa-static');
var mount = require('koa-mount');
var logger = require('koa-log');
var conf = require('./conf');
var app = koa();
require('koa-qs')(app);
require('babel-core/register')();
//var url = oauth.getAuthorizeURL(conf.site + '/login', 'state', 'snsapi_userinfo');
//console.log(url);
app.use(mount('/login', require('./routes/login')));
app.use(mount('/static', serve('static')));
app.use(function *() {
    this.body = this.query.echostr;
});
app.listen(8080);
