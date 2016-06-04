var api = require('../utility/wechat').api;
var conf = require('../conf');
var Badge = require('../models/Badge');

module.exports = function *() {
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
        url: conf.site + this.originalUrl
    };
    try {
        var params = yield *api.getJsConfig(param);
    } catch(err) {
        console.log(err);
        var params = {};
    }
    this.render('base', {
        js_params: JSON.stringify(params),
        openid: this.session.openid,
        my_badge: yield new Badge(this.session.openid).count()
    });
    console.log(this.body);
}
