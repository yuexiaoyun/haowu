import { Model as Post } from '../../mongodb_models/post';
import { Model as User } from '../../mongodb_models/user';
import { Model as Audio } from '../../mongodb_models/audio';
import { createAction } from 'redux-actions';

import _ from 'underscore';

// TODO: 订阅信息在这个接口再返回
export default function *() {
    // 获取原始的Post列表 status=2的Post仅作者本人可见
    var posts = yield Post.find({
        user_id: this.query._id,
        status: {$ne: 0}
    }).sort({_id: -1}).exec();

    // 获取语音是否已听
    var audio_ids = posts.map(post => post.audio_id);
    var audios = yield Audio.find({
        audio_id: { $in: audio_ids },
    }).select('audio_id reads').exec();

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_user_detail')({
                user_id: this.query._id,
                posts: posts.map(post=>Post.toBrowser(post, this.session.user_id)),
                audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id))
            })
        ]
    }
}
