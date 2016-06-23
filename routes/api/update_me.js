import {createAction} from 'redux-actions'
import {Model as Post} from '../../mongodb_models/post'
import {Model as User, findUsersByIds} from '../../mongodb_models/user'
import {Model as Notification} from '../../mongodb_models/notification'
import {Model as Comment} from '../../mongodb_models/comment'
import {Model as Audio} from '../../mongodb_models/audio'
import Badge from '../../models/Badge'
import _ from 'underscore'

export default function *() {
    var results = yield [
        User.findOne({_id: this.session.user_id}).select('subids clear_badge').exec(),
        new Badge(this.session.user_id).list()
    ];
    var user_ids = _.uniq([
        this.session.user_id,
        ...(results[0].subids || []),
        ...(results[1].map(result=>result.user_id2))
    ]);
    var users = yield findUsersByIds(this.session.user_id, user_ids);
    user_ids = users.map(user => user._id)

    // TODO: 互动区所有语音的已读未读
    this.body = {
        result: 'ok',
        actions: [
            createAction('users')(_.object(user_ids, users)),
            createAction('clear_badge_time')(results[0].clear_badge || null),
            createAction('notifications')(results[1]),
            createAction('subids')(results[0].subids)
        ]
    };
}
