import { Model as User } from '../mongodb_models/user'
import { Model as QrCode } from '../mongodb_models/qr_code'

module.exports = function *() {
    console.log(this.weixin);
    var { FromUserName, Content, MsgType, Event, EventKey } = this.weixin;

    if (MsgType == 'event') {
        if (Event == 'unsubscribe') {
            yield User.update({
                openid: FromUserName
            }, {
                openid: FromUserName,
                sub_status: 0
            });
        } else if (Event == 'subscribe'){
            yield User.update({
                openid: FromUserName
            }, {
                openid: FromUserName,
                sub_status: 1
            });
            this.body = '欢迎来到“物记”。\n\n“物记”希望让生活中每一个普通人，用最便捷最真实的方式，记录并分享好物；通过物，结识更多有意思的人。\n\n在这里，慢下来，说出你和物的故事，感受大家的声音，体验物带来的各种小确幸。\n\n点击底部“进入物记”，立刻体验。';
            return;
        } else if (Event == 'SCAN') {
            // TODO: 处理带参二维码关注的情况
            yield QrCode.update({
                _id: EventKey
            }, {
                openid: FromUserName
            });
            this.body = '已收到后台登录申请，请稍等片刻，页面会自动跳转';
            return;
        }
    }
    this.body = {
        type: "customerService"
    };
}
