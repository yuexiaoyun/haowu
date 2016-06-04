var User = require('../mongodb_models/user').Model;
var Post = require('../mongodb_models/post').Model;
var Notification = require('../mongodb_models/notification').Model;

export default class Badge {
    constructor(openid) {
        this.openid = openid;
    }
    async count() {
        if (!this.user)
            this.user = await User.findOne({openid: this.openid}).select('clear_badge').exec();
        var q = this.user.clear_badge
            ? { uptime: { $gt: this.user.clear_badge} }
            : {};
        q = {...q, openid: this.openid};
        return await Notification.count(q);
    }
    async clear() {
        return await User.update({openid: this.openid}, {clear_badge: new Date()}).exec();
    }
    async list() {
        var docs = await Notification.find({openid: this.openid}).sort({uptime:-1}).exec();
        var results = [];
        for (var d of docs) {
            d = d.toObject();
            d.user = await User.findOne({openid: d.openid2}).select('nickname headimgurl').exec();
            if (d.type == 'like') {
                d.post = await Post.findOne({_id: d.target}).select('pic_id').exec();
            }
            results.push(d);
        }
        return results;
    }
}
