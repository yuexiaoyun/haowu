require('babel-polyfill');
require('babel-register')();

var co = require('co');
var Post = require('../mongodb_models/post').Model;
var updateScore = require('../models/Score').updateScore;

co.wrap(function *() {
    var posts = yield Post.find({}).select('_id').exec();
    for (var i in posts) {
        console.log('\n' + _id);
        var _id = posts[i]._id;
        yield updateScore(_id);
    }
})().then(function () {
}).catch(function (err) {
    console.log(err);
    console.log(err.stack);
});
