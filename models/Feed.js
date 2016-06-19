import {createAction} from 'redux-actions'
import {Model as Post} from '../mongodb_models/post'
import {Model as User} from '../mongodb_models/user'
import {Model as Notification} from '../mongodb_models/notification'
import {Model as Comment} from '../mongodb_models/comment'
import {Model as Audio} from '../mongodb_models/audio'
import createError from 'http-errors'
import Badge from './Badge'
import _ from 'underscore'

export default class Feed {
    static async loadMe(user_id) {
        // TODO: subids和notifications要支持分页？
        var results = await Promise.all([
            User.findOne({_id: user_id}).select('subids clear_badge').exec(),
            new Badge(user_id).list()
        ])
        var user_ids = _.uniq([
            user_id,
            ...(results[0].subids || []),
            ...(results[1].map(result=>result.user_id2))
        ]);
        var users = await User.find({
            _id: { $in: user_ids }
        }).select('_id headimgurl nickname sex subids status').exec()
        user_ids = users.map(user => user._id)

        // TODO: 互动区所有语音的已读未读
        return [
            createAction('users')(_.object(user_ids, users.map(user=>User.toBrowser(user, user_id)))),
            createAction('clear_badge_time')(results[0].clear_badge || null),
            createAction('notifications')(results[1]),
            createAction('subids')(results[0].subids)
        ]
    }
    static async deletePost(user_id, _id) {
        var q = { _id:_id, user_id:user_id, status: {$ne: 0} };
        var d = {
            status: 0
        };
        var update = await Post.update(q, d);
        if (update.nModified > 0) {
            var q = { target: _id };
            await Notification.remove(q).exec();
            return [
                createAction('delete_my_post')(_id),
                createAction('posts')(_.object([_id],[null]))
            ];
        } else {
            return [];
        }
    }
}
