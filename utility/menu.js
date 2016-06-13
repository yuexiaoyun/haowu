var co = require('co');
var api = require('./wechat').api;
var conf = require('../conf');
var menu = {
    button: [{
        type: "view",
        name: "进入物记",
        url: conf.site + '/app/home'
    }, {
        type: "view",
        name: "开发版",
        url: 'http://haowu.tunnel.qydev.com/app/home'
    }]
};

co.wrap(function *() {
    var result = yield* api.createMenu(menu);
    console.log(result);
})().then(function () {
}).catch(function (err) {
    console.log(err);
});
