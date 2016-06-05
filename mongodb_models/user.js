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
    subids: { type: [String] },
    clear_badge: { type: Date }
});

schema.index({ openid: 1 }, { unique: 1});

var Model = mongo.conn.model('user', schema);
module.exports.Model = Model;

Model.toBrowser = (doc, openid) => {
    doc = doc.toObject();
    doc.subbed = doc.subids && doc.subids.indexOf(openid) >= 0;
    delete doc.subids;
    return doc;
}
