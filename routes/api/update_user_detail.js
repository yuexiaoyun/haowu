import { Model as Post, findPosts } from '../../mongodb_models/post';
import { Model as User, findUsers, findUserById } from '../../mongodb_models/user';
import { Model as Audio } from '../../mongodb_models/audio';
import { Model as Topic } from '../../mongodb_models/topic';
import { createAction } from 'redux-actions';

import _ from 'underscore';

module.exports = function*() {
    // 获取用户基本信息
    var user = yield findUserById(this.session.user_id, this.query._id);
    if (!user)
        this.throw(404);
    // 获取原始的Post列表 status=2的Post仅作者本人可见
    var posts = yield findPosts(this.session.user_id, {
        user_id: this.query._id,
        status: {$ne: 0}
    }, [{
        $sort: {_id: -1 }
    }]);
    // 获取语音是否已听
    var audio_ids = posts.map(post => post.audio_id);
    var audios = yield Audio.find({
        audio_id: { $in: audio_ids },
    }).select('audio_id reads').exec();

    // 获取用户的专辑列表
    var topics = yield Topic.find({
        user_id: this.query._id,
        status: 1
    }).sort({
        _id: -1
    }).exec();

    if (this.session.user_id == this.query._id) {
        var users = yield findUsers(this.session.user_id, {
            subids: this.session.user_id
        });
        user.me_subids = users.map(user=>user._id);
        users = [user, ...users];
    } else {
        var users = [user];
    }

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_user_detail')({
                users,
                posts,
                topics,
                audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id))
            })
        ]
    }
}
