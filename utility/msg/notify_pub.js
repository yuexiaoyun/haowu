import { Model as User } from '../../mongodb_models/user'
import { Model as Notification } from '../../mongodb_models/notification'
import { updateScore } from '../../models/Score'
import { updateCount } from '../../models/Count'
import conf from '../../conf'

module.exports = function*({user_id, post_id}) {
    try {
        var uids = (yield User.findById(user_id).select('subids')) || [];
        for (var i in uids) {
            var sub_user_id = uids[i];
            var notification = new Notification();
            notification.user_id = sub_user_id;
            notification.user_id2 = user_id;
            notification.type = 'pub';
            notification.target = post_id;
            notification.uptime = new Date();
            yield notification.save();
        }
        // 重算Feed分数
        yield updateScore(post_id);
        // 重算个人的发帖数和被听数
        yield updateCount(user_id);
    } catch(err) {
        console.log(err.stack);
        throw(err);
    }
}
