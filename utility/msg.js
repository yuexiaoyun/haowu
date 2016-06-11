import { api as wechat } from './wechat'
import conf from '../conf'

// TODO 调研微信能不能删除模板消息
export function notifyLike(session, post) {
    return wechat.sendTemplate(
        post.user_id,
        'FRTOKz43duOUsJI2BQdQGSd4qpl0r7g0RvEJewx5zkA',
        conf.site + '/app/post/' + post._id,
        '#FF0000', {
            first: {
                value: session.userInfo.nickname,
                color: "#173177"
            }
        });
}

export function notifyComment(session, post, comment) {
    return wechat.sendTemplate(
        post.user_id,
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

export function notifyReply(session, comment, reply) {
    return wechat.sendTemplate(
        reply.user_id2,
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
