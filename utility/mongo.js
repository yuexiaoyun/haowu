var mongoose = require('mongoose');
var conf = require('../conf');
var conn = mongoose.createConnection(conf.mongodb);
conn.useDb('haowu');
exports.conn = conn;
