var conf = require('../conf');
var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 简单的存储
var schema = new mongoose.Schema({
    key: { type: String },
    value: { type: mongoose.Schema.Types.Mixed }
});

schema.index({ key: 1 });

var Model = mongo.conn.model('config', schema);
module.exports.Model = Model;
