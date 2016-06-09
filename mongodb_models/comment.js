var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

var schema = new mongoose.Schema({
    openid: { type: String },
    post_id: { type: String },
    text: { type: String },
    audio_id: { type: String },
    d: { type: Number },
    replies: [{
        openid: { type: String },
        openid2: { type: String },
        text: { type: String },
        audio_id: { type: String }
    }],
    uptime: { type: Date },
    status: { type: Number }
});

schema.index({ post_id: 1 });
schema.index({ uptime: 1 });

var Model = mongo.conn.model('comment', schema);
module.exports.Model = Model;
