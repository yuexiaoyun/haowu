import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { Model as Post, findPostsByIds } from '../../mongodb_models/post';
import { Model as Audio } from '../../mongodb_models/audio';
import { Model as Notification } from '../../mongodb_models/notification';
import { createAction } from 'redux-actions';
import _ from 'underscore';

export default function*() {
    // 获取通知
    var notifications = yield Notification.find({
        user_id: this.session.user_id
    }).sort({

    }).exec();

    var post_ids = _.chain(notifications.map(notification=>notification.target))
        .compact()
        .uniq()
        .value();

    // 获取原始Post
    var posts = yield Post.find({
        _id: { $in: post_ids }
    }).exec();

    // 获取通知区域出现的所有语音
    var audio_ids = _.chain(notifications.map(notification=>notification.audio_id))
        .compact()
        .uniq()
        .value();
    var audios = yield Audio.find({
        audio_id: { $in: audio_ids },
    }).select('audio_id reads').exec();

    var user = yield User.findByIdAndUpdate(this.session.user_id, {
        $set: {
            clear_badge_time: new Date()
        }
    }).select('clear_badge_time subids').exec();

    // 获取用户
    var users = yield findUsersByIds(
        this.session.user_id, [
            ...notifications.map(notification=>notification.user_id2),
            ...user.subids
        ]
    );

    this.body = {
        result: 'ok',
        clear_badge_time: user.clear_badge_time,
        actions: [
            createAction('update_notifications')({
                users,
                subids: user.subids,
                notifications,
                posts: posts.map(post=>Post.toBrowser(post, this.session.user_id)),
                audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id))
            })
        ]
    }
}
