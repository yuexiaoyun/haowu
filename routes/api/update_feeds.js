import { Model as Post } from '../../mongodb_models/post';
import { Model as User } from '../../mongodb_models/user';
import { Model as Audio } from '../../mongodb_models/audio';
import { createAction } from 'redux-actions';

import _ from 'underscore';

export default function *() {
    // 获取原始的Post列表 status=2的Post仅作者本人可见
    var q = {
        $or: [
            { status: 1 },
            { status: 2, user_id: this.session.user_id}
        ]
    }
    if (this.query.beforeid)
        q = { ...q, _id: {$lt: this.query.beforeid} }
    var posts = yield Post.find(q).sort({_id:-1}).limit(21).exec();
    var feed_end = 1;
    if (posts.length == 21) {
        feed_end = 0;
        posts = _.first(posts, 20);
    }

    // 获取Post的作者信息
    var user_ids = _.uniq(posts.map(post => post.user_id))
    var users = yield User.find({
        _id: { $in: user_ids }
    }).select('_id headimgurl nickname subids status').exec()

    // 获取语音是否已听
    var audio_ids = posts.map(post => post.audio_id);
    var audios = yield Audio.find({
        audio_id: { $in: audio_ids },
    }).select('audio_id reads').exec();

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_feeds')({
                users: users.map(user=>User.toBrowser(user, this.session.user_id)),
                posts: posts.map(post=>Post.toBrowser(post, this.session.user_id)),
                audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id)),
                concat: !!this.query.beforeid,
                feed_end,
            })
        ]
    }
}
