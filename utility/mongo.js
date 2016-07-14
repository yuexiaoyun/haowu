var mongoose = require('mongoose');
var conf = require('../conf');
var conn = mongoose.createConnection(conf.mongodb);
exports.conn = conn.useDb('haowu');
exports.conn.on('error', console.log);
