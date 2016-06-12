var User = require('../mongodb_models/user').Model;

module.exports = function *() {
    var doc = yield User.findOne({_id: this.query.user_id});
    if (!doc) {
        this.throw(404);
    }
    this.session.user_id = doc._id.toString();
    this.session.userInfo = doc.toObject();
    this.body = 'OK';
}
