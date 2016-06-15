import qiniu from '../../utility/qiniu';
import { Model as Post } from '../../mongodb_models/post';
import { createAction } from 'redux-actions';
import { notifyPub } from '../../utility/msg';

export default function *() {
    console.log('here');
    var post = new Post();
    Object.assign(post, this.query);
    post.user_id = this.session.user_id;
    yield [
        qiniu.sync(post.audio_id),
        qiniu.sync(post.pic_id)
    ];
    yield qiniu.pfop(post.audio_id);
    var info = JSON.parse(yield qiniu.stat(post.pic_id));
    post.w = info.width;
    post.h = info.height;
    post.status = 1;
    yield post.save();
    yield notifyPub(this.session, post);
    this.body = {
        result: 'ok',
        actions: [
            createAction('pub_post')()
        ]
    };
}
