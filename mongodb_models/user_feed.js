var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 用户的首页Feed记录
var schema = new mongoose.Schema({
    // 发布者的user_id
    user_id: { type: String },
    // 用户已刷出的首页Feed列表
    posts: [{ type: String }]
}, {
    timestamps: true
});

schema.index({ user_id: 1 });
schema.index({ posts: 1 });

var Model = mongo.conn.model('user_feed', schema);
module.exports.Model = Model;