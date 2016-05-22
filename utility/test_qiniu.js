var qiniu = require('./qiniu');
var co = require('co');

co.wrap(function *() {
    console.log(5);
    yield qiniu.sync("YL7oo-_GmdjchKnQmHAUhb1OhgjiIJ8cfPyNg3sVD0e1P9I3_Na9MBwLWGoLnPYm");
    console.log(52);
})().then(function(data) {
}).catch(function(err) {
    console.log(err.stack);
});
