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

export function *notifyPub(session, post) {
    var doc = yield User.findOne({_id: session.user_id}).select('subids').exec();
    var subids = doc.subids || [];
    var docs = yield User.find({_id: {$in: subids}}).select('openid').exec();

    for (var i in docs) {
        var openid = docs[i].openid;
        if (openid) {
            console.log(yield wechat.sendTemplate(
                openid,
                'coonwl1GcNnQrZEyrdpa-Jls2V5rZHiUT-_RyeKndbk',
                conf.site + '/app/post/' + post._id,
                '#FF0000', {
                    first: {
                        value: session.userInfo.nickname,
                        color: "#173177"
                    }
                }));
        }
    }
}

export function *notifySub(session, user_id) {
    var openid = yield getOpenid(user_id);
    if (openid) {
        return yield wechat.sendTemplate(
            openid,
            '3JFrw9e6GFGUKjAHBWZCvSYyKl9u-JGIf7Idn5VSolU',
            target,
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
