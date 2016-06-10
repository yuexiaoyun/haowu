var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 互动区通知
var schema = new mongoose.Schema({
    // 通知接收方openid
    openid: { type: String },
    // 通知发起方openid
    openid2: { type: String },
    // 通知类型
    // sub: 订阅
    // like：点赞
    // comment: 评论
    // reply：回复
    type: { type: String },
    // 主贴id like/comment/reply这三种类型的通知有此字段
    target: { type: String },
    // 评论id comment/reply这两种类型的通知有此字段
    comment_id: { type: String },
    // 回复id reply类型的通知有此字段
    reply_id: { type: String },
    // 评论/回复文字 comment/reply两种类型，且内容为文字时，有此字段
    text: { type: String },
    // 评论/回复语音id comment/reply两种类型，且内容为语音时，有此字段
    audio_id: { type: String },
    // 评论/回复语音不精确的长度 comment/reply两种类型，且内容为语音时，有此字段
    d: { type: Number },
    // 通知发布时间，在user表clear_badge字段之后发布的通知即为未读通知
    uptime: { type: Date }
});

schema.index({ openid: 1, uptime: -1});

var Model = mongo.conn.model('notification', schema);
module.exports.Model = Model;
