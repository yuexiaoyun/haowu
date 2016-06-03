var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

var schema = new mongoose.Schema({
    openid: { type: String },
    pic_id: { type: String },
    audio_id: { type: String },
    length: { type: Number },
    w: { type: Number },
    h: { type: Number },
    likes: { type: [String] },
    reads: { type: [mongoose.Schema.ObjectId] }
});

schema.index({ openid: 1 });

var Model = mongo.conn.model('post', schema);
module.exports.Model = Model;
