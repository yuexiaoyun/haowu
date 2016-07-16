import { Model as Post, findPostsByIds } from '../../mongodb_models/post';
import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { Model as Topic } from '../../mongodb_models/topic';
import { Model as Audio } from '../../mongodb_models/audio';
import { createAction } from 'redux-actions';

import _ from 'underscore';

module.exports = function*() {
    var topics = yield Topic.find({
        status: 1
    }).sort({_id: -1}).exec();
    // 获取原始的Post列表
    var post_ids = _.chain(topics)
        .map(topic=>topic.posts)
        .flatten()
        .uniq()
        .value();
    var posts = yield findPostsByIds(this.session.user_id, post_ids);
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
            createAction('update_topics')({
                topics,
                users,
                posts,
                audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id))
            })
        ]
    }
}
