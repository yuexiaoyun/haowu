var WechatAPI = require('co-wechat-api');
var OAuth = require('wechat-oauth');
var conf = require('../conf');

var Config = require('../mongodb_models/config').Model;
var api = new WechatAPI(conf.appid, conf.secret, function *() {
    var doc = yield Config.findOne({key: 'wj_wechat_token'}).exec();
    return doc ? JSON.parse(doc.value) : null;
}, function *(token) {
    yield Config.update({key: 'wj_wechat_token'}, {value: JSON.stringify(token)}, {upsert: true});
});

api.registerTicketHandle(function*(type) {
    try {
        var doc = yield Config.findOne({key: 'wj_wechat_ticket_' + type}).exec();
        return doc ? JSON.parse(doc.value) : null;
    } catch (err) {
        console.log(err);
    }
}, function*(type, value) {
    yield Config.update({key: 'wj_wechat_ticket_' + type}, {value: JSON.stringify(value)}, {upsert: true});
});

var oauth = new OAuth(conf.appid, conf.secret);

module.exports = {
    api: api,
    oauth: oauth
};
