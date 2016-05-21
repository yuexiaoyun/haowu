var WechatAPI = require('co-wechat-api');
var OAuth = require('wechat-oauth');
var conf = require('../conf');
var api = new WechatAPI(conf.appid, conf.secret);
var oauth = new OAuth(conf.appid, conf.secret);

module.exports = {
    api: api,
    oauth: oauth
};

/*
var param = {
    debug: false,
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
    ],
    url: 'http://haowu.tunnel.qydev.com/static/test.html'
};
api.getJsConfig(param, function(err, data) {
    console.log(err);
    console.log(data);
});
*/
