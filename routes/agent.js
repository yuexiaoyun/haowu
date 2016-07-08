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
            this.body = 'HI，别太奔波，偶尔停下来，分享自己，听听他人。\n\n点击菜单栏“进入物记”：\n60秒的真实声音聊件好物，以物会友，遇见真实的你和Ta。\n\n就想勾搭我们？\n公众号直接聊天，或者，点最右菜单找到组织。';
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
