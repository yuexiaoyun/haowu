var api = require('./wechat').api;
var co = require('co');
var conf = require('../conf');

var topcolor = '#FF0000'; // 顶部颜色
var data = {
     first: {
       "value":'文案文案文案文案文案文案很多的文案',
       "color":"#173177"
     }
};
co.wrap(function *() {
    yield api.sendTemplate(
        'o4yMIwu6cBQEadLOAhw9TDU6zA60',
        'H8d58VWxWVi1KHRwkzdNvOKS_OuEaVYVDroSJByKvk8',
        conf.site + '/app/post/574062b788749448d5c4efaf',
        topcolor,
        data);
})().then(function(data) {

}).catch(function(err) {
    console.log(err);
});
