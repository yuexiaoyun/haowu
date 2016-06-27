var api = require('../utility/wechat').api;
var conf = require('../conf');

import {Model as User} from '../mongodb_models/user'

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
        url: `http://${this.host}${this.originalUrl}`
    };
    try {
        var params = yield *api.getJsConfig(param);
    } catch(err) {
        console.log(err);
        var params = {};
    }

    var user = yield User.findById(this.session.user_id).select('sub_status').exec();

    this.render('base', {
        js_params: JSON.stringify(params),
        user_id: this.session.user_id,
        sub_status: user.sub_status || 0
    });
    console.log(this.body);
}
