var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 语音
var schema = new mongoose.Schema({
    audio_id: { type: String},
    // 所有听过这一段语音的user_id
    reads: [{ type: String}]
});

schema.index({ audio_id: 1 });

var Model = mongo.conn.model('audio', schema);
module.exports.Model = Model;

Model.toBrowser = (doc, user_id) => {
    doc = doc.toObject();
    doc.me_read = doc.reads && doc.reads.indexOf(user_id) >= 0;
    doc.read_count = doc.reads ? doc.reads.length : 0;
    delete doc.reads;
    return doc;
}
