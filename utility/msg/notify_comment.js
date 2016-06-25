import { api as wechat } from '../wechat'
import { Model as User } from '../../mongodb_models/user'
import { Model as Notification } from '../../mongodb_models/notification'
import { updateScore } from '../../models/Score'
import conf from '../../conf'
import co from 'co'

export default function *({user_id, nickname, post_id, post_user_id, comment}) {
    var notification = new Notification();
    notification.user_id = post_user_id;
    notification.user_id2 = user_id;
    notification.type = 'comment';
    notification.target = post_id;
    notification.comment_id = comment._id;
    notification.audio_id = comment.audio_id;
    notification.d = comment.d;
    notification.text = comment.text;
    notification.uptime = new Date();
    yield notification.save();

    // 重算Feed分数
    yield updateScore(post_id);

    // 公众号通知
    var doc = yield User.findOne({
        _id: post_user_id
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
                    value: comment.text || [语音],
                    color: "#000000"
                }
            }
        ));
    }
}
