var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');
var ObjectID = require('bson/lib/bson/objectid')

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
    // 标题
    title: { type: String },
    // 所有点了赞的用户的user_id
    likes: [{ type: String }],
    // status=0：已被删除
    // status=1：正常状态
    // status=2：已屏蔽；其他人在主Feed流里不可见
    status: { type: Number },
    // 基础权重评分
    rank0: { type: Number}
});

schema.index({ user_id: 1 });
schema.index({ rank0: 1 });

var Model = mongo.conn.model('post', schema);
module.exports.Model = Model;

module.exports.findPosts = function *(user_id, q, as) {
    var aggrs = [{
        $match: q
    }, {
        $project: {
            _id: 1,
            user_id: 1,
            pic_id: 1,
            audio_id: 1,
            length: 1,
            w: 1,
            h: 1,
            title: 1,
            status: 1,
            me_like: {
                $setIsSubset: [[user_id], '$likes']
            },
            like_count: {
                $size: '$likes'
            }
        }
    }, ...(as || [])];
    var docs = yield Model.aggregate(aggrs).exec();
    console.log(docs);
    return docs;
}

module.exports.findPostsByIds = function *(user_id, ids) {
    var q = {
        _id: {
            $in: ids.map(id=>new ObjectID(id))
        }
    }
    return yield module.exports.findPosts(user_id, q);
}

module.exports.findPostById = function*(user_id, id) {
    var docs = yield module.exports.findPostsByIds(user_id, [id]);
    return docs.length > 0 ? docs[0] : null;
}
