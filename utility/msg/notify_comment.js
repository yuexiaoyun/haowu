import { api as wechat } from '../wechat'
import { Model as User } from '../../mongodb_models/user'
import { Model as Notification } from '../../mongodb_models/notification'
import { updateScore } from '../../models/Score'
import conf from '../../conf'
import co from 'co'

import moment from 'moment'

module.exports = function*({user_id, nickname, post_id, post_user_id, comment}) {
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
    }).select('openid sub_status').exec();

    if (doc && doc.openid && doc.sub_status == 1) {
        console.log(yield wechat.sendTemplate(
            doc.openid,
            'cxJCSZV2RJnSc2h9dZRZ7dYfXxSiT4mGtiZSN2GEChU',
            conf.site + '/app/me/notifications',
            '#FF0000', {
                first: {
                    value: '你收到一条评论回复通知。',
                    color: '#000000'
                },
                keyword1: {
                    value: nickname,
                    color: "#173177"
                },
                keyword2: {
                    value: moment().format('YYYY-MM-DD HH:mm:ss'),
                    color: "#173177"
                },
                keyword3: {
                    value: comment.text || '[语音]',
                    color: "#173177"
                },
                remark: {
                    value: '进入物记与Ta互动哦~',
                    color: '#000000'
                }
            }
        ));
    }
}
