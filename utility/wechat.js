var WechatAPI = require('co-wechat-api');
var OAuth = require('wechat-oauth');
var conf = require('../conf');
var api = new WechatAPI(conf.appid, conf.secret);
var oauth = new OAuth(conf.appid, conf.secret);

module.exports = {
    api: api,
    oauth: oauth
};
