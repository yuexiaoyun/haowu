import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { Model as Post, findPostsByIds } from '../../mongodb_models/post';
import { Model as Audio } from '../../mongodb_models/audio';
import { Model as Notification } from '../../mongodb_models/notification';
import { createAction } from 'redux-actions';
import _ from 'underscore';

module.exports = function*() {
    // 区分分页加载
    var q = this.query.before_uptime ? {
        uptime: { $lt: this.query.before_uptime }
    } : {};

    // 获取通知并设置分页结束信号
    var notifications = yield Notification.find({
        user_id: this.session.user_id,
        ...q
    }).sort({
        uptime: -1
    }).limit(21).exec();

    var notification_end = 1;
    if (notifications.length == 21) {
        notification_end = 0;
        notifications.pop();
    }

    // 获取通知里涉及到的原始Post
    var post_ids = _.chain(notifications.map(notification=>notification.target))
        .compact()
        .uniq()
        .value();
    var posts = yield findPostsByIds(this.session.user_id, post_ids);

    // 获取通知区域和通知区域的Post出现的所有语音
    var audio_ids = _.chain([
        ...notifications.map(notification=>notification.audio_id),
        ...posts.map(post=>post.audio_id)
    ]).compact()
        .uniq()
        .value();
    var audios = yield Audio.find({
        audio_id: { $in: audio_ids },
    }).select('audio_id reads').exec();

    // 获取互动区和我订阅的用户列表
    // TODO: 我订阅的用户列表应该先出数，后续再一个单独的请求来取列表？
    var user = null;
    var user_ids = [
        ...notifications.map(notification=>notification.user_id2),
        ...posts.map(post=>post.user_id)
    ];
    if (!this.query.before_uptime) {
        user = yield User.findByIdAndUpdate(this.session.user_id, {
            $set: {
                clear_badge: new Date()
            }
        }).select('clear_badge subids').exec();
        user_ids = [...user_ids, ...user.subids];
    }
    var users = yield findUsersByIds(this.session.user_id, _.uniq(user_ids));

    if (user) {
        this.body = {
            result: 'ok',
            clear_badge: user && user.clear_badge || new Date(0),
            actions: [
                createAction('update_notifications')({
                    users,
                    subids: user.subids.reverse(),
                    notifications,
                    notification_end,
                    posts,
                    audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id))
                })
            ]
        }
    } else {
        this.body = {
            result: 'ok',
            actions: [
                createAction('update_notifications')({
                    users,
                    notifications,
                    notification_end,
                    concat: 1,
                    posts,
                    audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id))
                })
            ]
        }
    }

}
