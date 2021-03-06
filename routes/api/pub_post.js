import qiniu from '../../utility/qiniu';
import { Model as Post } from '../../mongodb_models/post';
import { Model as User, findUserById } from '../../mongodb_models/user';
import { Model as UserFeed } from '../../mongodb_models/user_feed';
import { createAction } from 'redux-actions';

import notifyPub from '../../utility/msg/notify_pub';
import co from 'co';

module.exports = function*() {
    var user = yield findUserById(this.session.user_id, this.session.user_id);
    if (!user)
        return 403;

    var post = new Post();
    // 填写基本字段
    Object.assign(post, this.query);
    post.user_id = this.session.user_id;
    // 上传微信的图片和语音去七牛
    yield [
        qiniu.sync(post.audio_id),
        qiniu.sync(post.pic_id)
    ];
    // 七牛的mp3转码
    yield qiniu.pfop(post.audio_id);
    // 从七牛获取图片宽高并写入
    var info = JSON.parse(yield qiniu.stat(post.pic_id));
    if (info.orientation && info.orientation == 'Right-top') {
        post.h = info.width;
        post.w = info.height;
    } else {
        post.w = info.width;
        post.h = info.height;
    }
    if (user.status != 1)
        post.status = 2;
    else
        post.status = 1;
    // 保存
    yield post.save();
    // 主Feed流上屏
    yield UserFeed.update({
        user_id: this.session.user_id
    }, {
        $push: {
            posts: {
                $each: [post._id],
                $position: 0
            }
        }
    }, {
        upsert: true
    });

    co(notifyPub({
        post_id: post._id,
        user_id: this.session.user_id,
    }));

    post = post.toObject();
    post.me_like = false
    post.like_count = 0;
    delete post.likes;

    this.body = {
        result: 'ok',
        id: post._id,
        actions: [
            createAction('pub_post')({
                posts: [post],
                users: [user]
            })
        ]
    };
}
