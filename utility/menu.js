var co = require('co');
var api = require('./wechat').api;
var conf = require('../conf');
var menu = {
    button: [{
        type: "view",
        name: "进入物记",
        url: conf.site + '/app/home'
    }, {
        type: 'media_id',
        name: '送物换物',
        media_id: 'egOrCsB_0y-VIJsP2uYkaMYd0ndtKwwEXRQeNfq-MW8'
    }, {
        type: "view_limited",
        name: "关于",
        media_id: 'egOrCsB_0y-VIJsP2uYkaNmkmw-7YshZc7R8gzVCWzI'
    }]
};

co.wrap(function *() {
    var result = yield* api.createMenu(menu);
    console.log(result);
    var result = yield* api.getMaterials('image', 0, 2);
    console.log(result.toString());
})().then(function () {
}).catch(function (err) {
    console.log(err);
});
