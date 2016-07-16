var co = require('co');
var api = require('./wechat').api;
var conf = require('../conf');
var menu = {
    button: [{
        type: "view",
        name: "进入物记",
        url: conf.site + '/app/home'
    }, {
        type: 'view',
        name: '制作专辑',
        url: conf.site + '/app/pub_topic'
    }, {
        type: 'media_id',
        name: '送物换物',
        media_id: 'egOrCsB_0y-VIJsP2uYkaMYd0ndtKwwEXRQeNfq-MW8'
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
