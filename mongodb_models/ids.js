var mongoose = require('mongoose');
var mongo = require('../utility/mongo');

// 全局id
var schema = new mongoose.Schema({
    type: {type: String},
    max_id: {type: Number}
}, {timestamps: true});

schema.index({ type: 1 });

var Model = mongo.conn.model('ids', schema);
module.exports.Model = Model;
