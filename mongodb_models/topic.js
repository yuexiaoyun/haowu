var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 专辑
var schema = new mongoose.Schema({
    // 标题
    title: { type: String },
    // post列表
    posts: [{ type: String }]
}, {
    timestamps: true
});

schema.index({ posts: 1 });

var Model = mongo.conn.model('topic', schema);
module.exports.Model = Model;
