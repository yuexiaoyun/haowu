var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 语音
var schema = new mongoose.Schema({
    // 指定_id type为String
    _id: { type: String },
    // 所有听过这一段语音的user_id
    reads: [{ type: String}]
});

var Model = mongo.conn.model('audio', schema);
module.exports.Model = Model;
