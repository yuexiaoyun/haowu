var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');
var ObjectID = require('bson/lib/bson/objectid')

// 用户
var schema = new mongoose.Schema({
    // 微信unionid
    unionid: { type: String },
    // 微信openid
    openid: { type: String },
    // 昵称
    nickname: { type: String },
    // 性别: 1为男，2为女
    sex: { type: Number },
    // 语言，微信提供的字段，我们暂时不用
    lauguage: { type: String },
    // 省份，微信提供的字段，我们暂时不用
    province: { type: String },
    // 城市，微信提供的字段，我们暂时不用
    city: { type: String },
    // 微信提供的字段，我们暂时不用
    country: { type: String },
    // 微信头像url，可以直接提供给客户端供显示
    headimgurl: { type: String },
    // 特权，微信提供的字段，我们暂时不用
    privilege: [{ type: String }],
    // 所有订阅了该用户的用户的user_id
    subids: [{ type: String }],
    // 上次清除通知未读标记的时间：所有在此时间之后创建的通知（notification）视作未读
    clear_badge: { type: Date },
    // 冗余存放的发布数
    post_count: { type: Number },
    // 冗余存放的被听数
    reads_count: { type: Number },
    // 冗余存放的被赞数
    liked_count: { type: Number },
    // 冗余存放的订阅数
    sub_count: { type: Number },
    // 签名：用户在App中编辑
    intro: { type: String },
    // 用户状态
    // status=1为正常
    // status=2为黑名单：该用户的所有发布的内容在主Feed流里对其它人不可见
    status: { type: Number },
    // 用户有没有关注公众号
    sub_status: { type: Number },
    // 是否封禁了评论和回复的权限
    block_comment_reply: { type: Number }
});

schema.index({ unionid: 1 }, { unique: 1});

var Model = mongo.conn.model('user', schema);
module.exports.Model = Model;

module.exports.findUsers = function *(user_id, q) {
    var docs = yield Model.aggregate([{
        $match: q
    }, {
        $project: {
            _id: 1,
            nickname: 1,
            headimgurl: 1,
            post_count: 1,
            reads_count: 1,
            sub_count: 1,
            liked_count: 1,
            intro: 1,
            status: 1,
            subbed: {
                $setIsSubset: [[user_id], '$subids']
            },
            subbed_count: {
                $size: '$subids'
            }
        }
    }]).exec();
    return docs;
}

module.exports.findUsersByIds = function *(user_id, ids) {
    var q = {
        _id: {
            $in: ids.map(id=>new ObjectID(id))
        }
    }
    return yield module.exports.findUsers(user_id, q);
}

module.exports.findUserById = function*(user_id, id) {
    var docs = yield module.exports.findUsersByIds(user_id, [id]);
    return docs.length > 0 ? docs[0] : null;
}
