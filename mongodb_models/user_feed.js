var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 用户的首页Feed记录：是否弹过tooltip也放在这张表里
var schema = new mongoose.Schema({
    // 发布者的user_id
    user_id: { type: String },
    // 用户已刷出的首页Feed列表
    posts: [{ type: String }],
    // 用户最后一次刷feed时上传的屏幕宽度
    width: { type: Number },
    // 用户最后一次刷feed时上传的dpr
    dpr: { type: Number },
    // 是否弹过tooltip
    tooltip_showed: { type: Number }
}, {
    timestamps: true
});

schema.index({ user_id: 1 });
schema.index({ posts: 1 });

var Model = mongo.conn.model('user_feed', schema);
module.exports.Model = Model;
