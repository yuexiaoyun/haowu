var Model = require('../mongodb_models/ids').Model;

module.exports.new_id = function * (type, offset) {
    type = type || 'mmid';
    offset = offset || 20000000; //不包含20000000
    var result = yield Model.findOneAndUpdate({type: type}, {$inc: {'max_id': 1}}, {upsert: true, new: true});
    return result.max_id + offset;
}
