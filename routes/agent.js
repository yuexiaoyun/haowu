import { Model as User } from '../mongodb_models/user'

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
            this.body = '欢迎关注物记公众号！';
            return;
        }
    } 
    this.body = {
        type: "customerService"
    };
}
