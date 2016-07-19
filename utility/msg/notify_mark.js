import { api as wechat } from '../wechat'
import { Model as Topic } from '../../mongodb_models/topic'
import { Model as User } from '../../mongodb_models/user'
import conf from '../../conf'
import qs from 'querystring'

import moment from 'moment'

module.exports = function*({topic_id}) {
    var topic = yield Topic.findById(topic_id);
    if (!topic)
        return;
    // 公众号通知
    var doc = yield User.findOne({
        _id: topic.user_id
    }).select('openid sub_status').exec();

    if (doc && doc.openid && doc.sub_status == 1) {
        console.log(yield wechat.sendTemplate(
            doc.openid,
            'OiKuYl5Ge0nRhXL8XVBsYrUOdM43hetMMEANVajO5Yw',
            conf.site + '/app/home/',
            '#FF0000', {
                first: {
                    value: '你提交的专辑内容已被采纳为精选。',
                    color: '#000000'
                },
                keyword1: {
                    value: topic.title,
                    color: "#173177"
                },
                keyword2: {
                    value: topic.posts.length,
                    color: "#173177"
                },
                remark: {
                    value: '期待你后续有更多棒棒哒专辑哦~',
                    color: '#000000'
                }
            }
        ));
    }
}
