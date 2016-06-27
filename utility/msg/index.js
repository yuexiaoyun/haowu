import { api as wechat } from '../wechat'
import { Model as User } from '../../mongodb_models/user'
import conf from '../../conf'

// TODO 调研微信能不能删除模板消息
// TODO 正式号的时候要调研template机制
// TODO 正是号的时候模板消息预判

function *getOpenid(user_id) {
    var doc = yield User.findOne({_id: user_id}).select('openid').exec();
    return doc && doc.openid;
}

var target = conf.site + '/app/me/notifications';

export function *notifyComment(session, post, comment) {
    var openid = yield getOpenid(post.user_id);
    if (openid) {
        return yield wechat.sendTemplate(
            openid,
            'jGs_WM8l95bgGzyeBnQfphxM0rxEiEkUau3VV3r51wM',
            target,
            '#FF0000', {
                first: {
                    value: session.userInfo.nickname,
                    color: "#173177"
                },
                second: {
                    value: comment.audio_id ? '[语音]' : comment.text,
                    color: "#000000"
                }
            });
    }
}
