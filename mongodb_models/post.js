var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 主贴
var schema = new mongoose.Schema({
    // 发布者的openid
    openid: { type: String },
    // 图片id，可以用来拼原图和各尺寸缩略图的URL
    pic_id: { type: String },
    // 语音id，用来拼语音mp3文件的URL
    audio_id: { type: String },
    // 不精确的语音长度，单位为毫秒；只能用于显示，不能用于客户端精准控制播放器
    length: { type: Number },
    // 精确的原图宽度
    w: { type: Number },
    // 精确的原图高度
    h: { type: Number },
    // 所有点了赞的用户的openid
    likes: [{ type: String }],
    // 所有听过语音的用户openid（该字段可能从这个表里去掉，另开新表）
    reads: [{ type: String }],
    // status=0：已被删除
    // status=1：正常状态
    // status=2：已屏蔽；其他人在主Feed流里不可见
    status: { type: Number }
});

schema.index({ openid: 1 });

var Model = mongo.conn.model('post', schema);
module.exports.Model = Model;

Model.toBrowser = (doc, openid) => {
    doc = doc.toObject();
    doc.me_like = doc.likes && doc.likes.indexOf(openid) >= 0;
    doc.me_read = doc.reads && doc.reads.indexOf(openid) >= 0;
    doc.read_count = doc.reads.length;
    delete doc.likes;
    delete doc.reads;
    return doc;
}
