var WechatAPI = require('co-wechat-api');
var OAuth = require('wechat-oauth');
var conf = require('../conf');

var Config = require('../mongodb_models/config').Model;
var api = new WechatAPI(conf.appid, conf.secret, function *() {
    var doc = yield Config.findOne({key: 'wechat_token'}).exec();
    return doc ? JSON.parse(doc.value) : null;
}, function *(token) {
    yield Config.update({key: 'wechat_token'}, {value: JSON.stringify(token)}, {upsert: true});
});
var oauth = new OAuth(conf.appid, conf.secret);

module.exports = {
    api: api,
    oauth: oauth
};
