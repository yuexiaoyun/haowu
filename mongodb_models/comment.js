var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 评论
var schema = new mongoose.Schema({
    // 评论者的openid
    openid: { type: String },
    // 主贴的_id
    post_id: { type: String },
    // 评论文本，仅当评论类型为文本的时候
    text: { type: String },
    // 评论语音id，仅当评论类型为语音的时候
    audio_id: { type: String },
    // 评论语音不精确的长度，仅当评论类型为语音的时候
    d: { type: Number },
    // 回复
    replies: [{
        // 回复者的openid
        openid: { type: String },
        // 被回复者的openid
        openid2: { type: String },
        // 回复文本，仅当回复类型为文本的时候
        text: { type: String },
        // 回复语音id，仅当回复类型为语音的时候
        audio_id: { type: String },
        // 回复语音不精确的长度，仅当回复类型为语音的时候
        d: { type: Number }
    }],
    // 最后一条回复发布的时间；这个字段的主要目的是提供给admin平台用作监控
    uptime: { type: Date },
    // status=1: 正常状态
    // status=0: 评论已被删除
    status: { type: Number }
});

schema.index({ post_id: 1 });
schema.index({ 'replies._id': 1 });
schema.index({ uptime: 1 });

var Model = mongo.conn.model('comment', schema);
module.exports.Model = Model;
