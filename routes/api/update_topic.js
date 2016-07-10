import { Model as Post, findPostsByIds } from '../../mongodb_models/post';
import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { Model as Topic } from '../../mongodb_models/topic';
import { Model as Audio } from '../../mongodb_models/audio';
import { createAction } from 'redux-actions';

import _ from 'underscore';

module.exports = function*() {
    // 获取用户基本信息
    var topic = yield Topic.findById(this.query._id);
    if (!topic)
        this.throw(404);
    console.log(topic);
    // 获取原始的Post列表
    var posts = yield findPostsByIds(this.session.user_id, topic.posts);
    // 获取语音是否已听
    var audio_ids = posts.map(post => post.audio_id);
    var audios = yield Audio.find({
        audio_id: { $in: audio_ids },
    }).select('audio_id reads').exec();
    // 获取用户信息
    var user_ids = _.uniq(posts.map(post=>post.user_id));
    var users = yield findUsersByIds(this.session.user_id, user_ids);

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_topic')({
                topic,
                users,
                posts,
                audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id))
            })
        ]
    }
}
