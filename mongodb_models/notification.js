var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 通知类型：
//   sub: 订阅
//   like: 点赞
//   comment: 评论
//   reply: 回复

// TODO：不必要的字段可以减少以节省空间
var schema = new mongoose.Schema({
    openid: { type: String },
    openid2: { type: String },
    type: { type: String },
    target: { type: String },
    comment_id: { type: String },
    reply_id: { type: String },
    text: { type: String },
    audio_id: { type: String },
    d: { type: Number },
    uptime: { type: Date }
});

schema.index({ openid: 1, uptime: -1});

var Model = mongo.conn.model('notification', schema);
module.exports.Model = Model;
