var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 用户对某条post的行为记录
var schema = new mongoose.Schema({
    // 用户id
    user_id: { type: String },
    // 用户已刷出的首页Feed列表
    post_id: { type: String },
    // 行为
    type: { type: String }
}, {
    timestamps: true
});

schema.index({ user_id: 1 });
schema.index({ post_id: 1 });

var Model = mongo.conn.model('user_post_ping', schema);
module.exports.Model = Model;
