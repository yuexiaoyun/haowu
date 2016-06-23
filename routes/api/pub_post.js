import qiniu from '../../utility/qiniu';
import { Model as Post } from '../../mongodb_models/post';
import { Model as User, findUserById } from '../../mongodb_models/user';
import { Model as UserFeed } from '../../mongodb_models/user_feed';
import { createAction } from 'redux-actions';
import { notifyPub } from '../../utility/msg';

import { updateScore } from '../../models/Score'
import { updateCount } from '../../models/Count'

export default function *() {
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
    post.w = info.width;
    post.h = info.height;
    post.status = 1;
    // 保存
    yield post.save();
    // 给订阅用户发消息
    yield notifyPub(this.session, post);
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
    // 获取上屏所需要的user字段
    var user = yield findUserById(this.session.user_id, this.session.user_id);

    // 算分
    yield updateScore(post._id);
    // 重算用户的发帖数和被听数
    yield updateCount(post.user_id);

    this.body = {
        result: 'ok',
        actions: [
            createAction('pub_post')({
                posts: [Post.toBrowser(post, this.session.user_id)],
                users: [user]
            })
        ]
    };
    console.log(this.body);
}
