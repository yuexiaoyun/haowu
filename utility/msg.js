import { api as wechat } from './wechat'
import { Model as User } from '../mongodb_models/user'
import conf from '../conf'

// TODO 调研微信能不能删除模板消息
// TODO 正式号的时候要调研template机制

function *getOpenid(user_id) {
    var doc = yield User.findOne({_id: user_id}).select('openid').exec();
    return doc && doc.openid;
}

export function *notifyLike(session, post) {
    var openid = yield getOpenid(post.user_id);
    if (openid) {
        return yield wechat.sendTemplate(
            openid,
            'FRTOKz43duOUsJI2BQdQGSd4qpl0r7g0RvEJewx5zkA',
            conf.site + '/app/post/' + post._id,
            '#FF0000', {
                first: {
                    value: session.userInfo.nickname,
                    color: "#173177"
                }
            });
    }
}

export function *notifyComment(session, post, comment) {
    var openid = yield getOpenid(post.user_id);
    if (openid) {
        return yield wechat.sendTemplate(
            openid,
            'jGs_WM8l95bgGzyeBnQfphxM0rxEiEkUau3VV3r51wM',
            conf.site + '/app/post/' + post._id + '/' + comment._id,
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

export function *notifyReply(session, comment, reply) {
    var openid = yield getOpenid(reply.user_id2);
    if (openid) {
        return yield wechat.sendTemplate(
            openid,
            'EmQHRZ1nyZ1bNAE3R7bflOgmE3kYXT0pn_RXLaaFHQk',
            `${conf.site}/app/post/${comment.post_id}/${reply._id}`,
            '#FF0000', {
                first: {
                    value: session.userInfo.nickname,
                    color: "#173177"
                },
                second: {
                    value: reply.audio_id ? '[语音]' : reply.text,
                    color: "#000000"
                }
            });
    }
}
