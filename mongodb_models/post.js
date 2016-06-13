var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 主贴
var schema = new mongoose.Schema({
    // 发布者的user_id
    user_id: { type: String },
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
    // 所有点了赞的用户的user_id
    likes: [{ type: String }],
    // status=0：已被删除
    // status=1：正常状态
    // status=2：已屏蔽；其他人在主Feed流里不可见
    status: { type: Number }
});

schema.index({ user_id: 1 });

var Model = mongo.conn.model('post', schema);
module.exports.Model = Model;

// TODO: likes不要先取到应用端，而是直接在mongdb里处理
Model.toBrowser = (doc, user_id) => {
    doc = doc.toObject();
    doc.me_like = doc.likes && doc.likes.indexOf(user_id) >= 0;
    doc.others_like_count = doc.likes ? (doc.likes.length - (doc.me_like ? 1 : 0)) : 0;
    delete doc.likes;
    delete doc.reads;
    return doc;
}
