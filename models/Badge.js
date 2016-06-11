var User = require('../mongodb_models/user').Model;
var Post = require('../mongodb_models/post').Model;
var Notification = require('../mongodb_models/notification').Model;

export default class Badge {
    constructor(user_id) {
        this.user_id = user_id;
    }
    async clear() {
        return await User.update({_id: this.user_id}, {clear_badge: new Date()}).exec();
    }
    // TODO: 这里要做性能优化
    async list() {
        var docs = await Notification.find({user_id: this.user_id}).sort({uptime:-1}).exec();
        var results = [];
        for (var d of docs) {
            d = d.toObject();
            if (d.type != 'sub') {
                d.post = await Post.findOne({_id: d.target}).select('pic_id').exec();
            }
            results.push(d);
        }
        return results;
    }
}
