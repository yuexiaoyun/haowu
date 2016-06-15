import { Model as User } from '../../mongodb_models/user';
import { Model as Notification } from '../../mongodb_models/notification';

export default function*() {
    var q = { _id: this.query._id };
    var d = {
        $addToSet: {
            subids: this.session.user_id
        }
    };
    var update = yield User.update(q, d);
    console.log(update);
    if (update.nModified > 0 && this.query.user_id != this.session.user_id) {
        /*
        yield wechat.sendTemplate(
            this.query.user_id,
            '3JFrw9e6GFGUKjAHBWZCvSYyKl9u-JGIf7Idn5VSolU',
            conf.site + '/app/me/notifications',
            '#FF0000', {
                first: {
                    value: this.session.userInfo.nickname,
                    color: "#173177"
                }
            });
        */
        var query = {
            user_id: this.query.user_id,
            user_id2: this.session.user_id,
            type: 'sub'
        }
        console.log(yield Notification.update(query, {
            ...query,
            uptime: new Date()
        }, { upsert: true }));
    }
    this.body = yield {
        result: 'ok'
    };
}
