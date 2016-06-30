var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 记录每一个qrcode被哪一个openid扫了
var schema = new mongoose.Schema({
    _id: { type: Number },
    token: { type: String },
    imgurl: { type: String },
    openid: { type: String }
}, {timestamps: true});

schema.index({ token: 1 });

var Model = mongo.conn.model('qr_code', schema);
module.exports.Model = Model;
