var qs = require('querystring');
var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

var schema = new mongoose.Schema({
    openid: { type: String },
    nickname: { type: String },
    sex: { type: Number },
    lauguage: { type: String },
    province: { type: String },
    city: { type: String },
    country: { type: String },
    headimgurl: { type: String },
    privilege: [{ type: String }],
    subids: { type: [String] }
});

schema.index({ openid: 1 }, { unique: 1});

var Model = mongo.conn.model('user', schema);
module.exports.Model = Model;
