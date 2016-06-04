var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

var schema = new mongoose.Schema({
    openid: { type: String },
    openid2: { type: String },
    type: { type: String },
    target: { type: String },
    uptime: { type: Date }
});

schema.index({ openid: 1, openid2: 1, type: 1, target: 1 }, { unique: 1 });
schema.index({ openid2: 1 });

var Model = mongo.conn.model('notification', schema);
module.exports.Model = Model;
