import { api as wechat } from '../wechat'
import { Model as User } from '../../mongodb_models/user'
import { Model as Post } from '../../mongodb_models/post'
import { Model as Notification } from '../../mongodb_models/notification'
import conf from '../../conf'

export default function *({user_id, post_id}) {
    try {
        var post = yield Post.findOne({_id: post_id}).select('user_id').exec();
        if (!post)
            return;
        if (post.user_id != user_id) {
            var query = {
                user_id: post.user_id,
                type: 'like',
                target: post_id
            }
            console.log(yield Notification.update(query, {
                ...query,
                user_id2: user_id,
                uptime: new Date()
            }, { upsert: true }));
        }
    } catch(err) {
        console.log(err.stack);
        throw(err);
    }
}
