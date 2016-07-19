require('babel-polyfill');
require('babel-register')();

var co = require('co');
var notifyMark = require('./msg/notify_mark');

co.wrap(function *() {
    yield notifyMark({
        topic_id: '5789c7158e5dabb7084cb10a'
    });
})().then(function(data) {
}).catch(function(err) {
    console.log(err.stack);
});
