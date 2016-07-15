var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 专辑
var schema = new mongoose.Schema({
    // 用户
    user_id: { type: String },
    // 标题
    title: { type: String },
    // post列表
    posts: [{ type: String }],
    // status=0: 删除
    status: { type: Number }
}, {
    timestamps: true
});

schema.index({ posts: 1 });
schema.index({ user_id: 1 });

var Model = mongo.conn.model('topic', schema);
module.exports.Model = Model;
