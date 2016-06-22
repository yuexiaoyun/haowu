require('babel/register')({
    stage: 0
});

var co = require('co');
var User = require('../mongodb_models/user').Model;
var updateCount = require('../models/Count').updateCount;

co.wrap(function *() {
    var users = yield User.find({}).select('_id').exec();
    for (var i in users) {
        var _id = users[i]._id;
        yield updateCount(_id);
    }
})().then(function () {
}).catch(function (err) {
    console.log(err);
    console.log(err.stack);
});
