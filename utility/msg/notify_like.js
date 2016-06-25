import { api as wechat } from '../wechat'
import { Model as User } from '../../mongodb_models/user'
import { Model as Post } from '../../mongodb_models/post'
import { Model as Notification } from '../../mongodb_models/notification'
import conf from '../../conf'

export default function *({user_id, nickname, post_id}) {
    try {
        var post = yield Post.findOne({_id: post_id}).select('user_id').exec();
        if (!post)
            return;
        var query = {
            user_id: post.user_id,
            user_id2: user_id,
            type: 'like',
            target: post_id,
        }
        console.log(yield Notification.update(query, {
            ...query,
            uptime: new Date()
        }, { upsert: true }));

        // 公众号通知
        var doc = yield User.findOne({
            _id: post.user_id
        }).select('openid').exec();

        if (doc && doc.openid) {
            console.log(yield wechat.sendTemplate(
                doc.openid,
                'jGs_WM8l95bgGzyeBnQfphxM0rxEiEkUau3VV3r51wM',
                conf.site + '/app/me/notifications',
                '#FF0000', {
                    first: {
                        value: nickname,
                        color: "#173177"
                    },
                    second: {
                        value: comment.audio_id ? '[语音]' : comment.text,
                        color: "#000000"
                    }
                }));
        }
    } catch(err) {
        console.log(err.stack);
        throw(err);
    }
}
