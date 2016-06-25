import { api as wechat } from '../wechat'
import { Model as User } from '../../mongodb_models/user'
import { Model as Notification } from '../../mongodb_models/notification'
import { updateScore } from '../../models/Score'
import conf from '../../conf'
import co from 'co'

export default function *({user_id, nickname, post_id, comment_id, reply}) {
    // 站内互动区通知
    var notification = new Notification();
    notification.user_id = reply.user_id2;
    notification.user_id2 = user_id;
    notification.type = 'reply';
    notification.target = post_id;
    notification.comment_id = comment_id;
    notification.reply_id = reply._id;
    notification.audio_id = reply.audio_id;
    notification.d = reply.d;
    notification.text = reply.text;
    notification.uptime = new Date();
    yield notification.save();

    // 重算Feed分数
    yield updateScore(post_id);

    // 公众号通知
    var doc = yield User.findOne({
        _id: reply.user_id2
    }).select('openid').exec();

    if (doc && doc.openid) {
        console.log(yield wechat.sendTemplate(
            doc.openid,
            'EmQHRZ1nyZ1bNAE3R7bflOgmE3kYXT0pn_RXLaaFHQk',
            conf.site + '/app/me/notifications',
            '#FF0000', {
                first: {
                    value: nickname,
                    color: "#173177"
                },
                second: {
                    value: reply.text || '[语音]',
                    color: "#000000"
                }
            }
        ));
    }
}
