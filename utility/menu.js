var co = require('co');
var api = require('./wechat').api;
var conf = require('../conf');
var menu = {
    button: [{
        type: "view",
        name: "进入物记",
        url: conf.site + '/app/home'
    }, {
        name: '我是新人',
        sub_button: [{
            type: 'media_id',
            name: '意见反馈',
            media_id: 'egOrCsB_0y-VIJsP2uYkaJoJfzMWGC8b0MVZrshD-3Q'
        }, {
            type: "view_limited",
            name: "关于物记",
            media_id: 'egOrCsB_0y-VIJsP2uYkaNmkmw-7YshZc7R8gzVCWzI'
        }]
    }]
};

co.wrap(function *() {
    var result = yield* api.createMenu(menu);
    console.log(result);
    var result = yield* api.getMaterials('image', 0, 1);
    console.log(result.toString());
})().then(function () {
}).catch(function (err) {
    console.log(err);
});
