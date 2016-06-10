var User = require('../mongodb_models/user').Model;
var Post = require('../mongodb_models/post').Model;
var Notification = require('../mongodb_models/notification').Model;

export default class Badge {
    constructor(openid) {
        this.openid = openid;
    }
    async clear() {
        return await User.update({openid: this.openid}, {clear_badge: new Date()}).exec();
    }
    // TODO: 这里要做性能优化
    async list() {
        var docs = await Notification.find({openid: this.openid}).sort({uptime:-1}).exec();
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
