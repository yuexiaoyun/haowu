require('babel-polyfill');
require('babel-register')();

var co = require('co');
var notifyPub = require('./msg/notify_pub');

co.wrap(function *() {
    yield notifyPub({
        user_id: '575bad54fcba37b7afedd918',
        post_id: '57715e4d7902ddff4ec5fc9a'
    });
})().then(function(data) {
}).catch(function(err) {
    console.log(err.stack);
});
