var qs = require('querystring');
var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 用户
var schema = new mongoose.Schema({
    // 微信unionid
    unionid: { type: String },
    // 微信user_id
    user_id: { type: String },
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
    // 用户状态
    // status=1为正常
    // status=2为黑名单：该用户的所有发布的内容在主Feed流里对其它人不可见
    status: { type: Number }
});

schema.index({ unionid: 1 }, { unique: 1});

var Model = mongo.conn.model('user', schema);
module.exports.Model = Model;

Model.toBrowser = (doc, user_id) => {
    doc = doc.toObject();
    doc.subbed = doc.subids && doc.subids.indexOf(user_id) >= 0;
    delete doc.subids;
    return doc;
}
