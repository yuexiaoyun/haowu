import React from 'react'
import wx from 'weixin-js-sdk';

import styles from './UserInfo.css'
import CSSModules from 'react-css-modules';

class UserInfo extends React.Component {
    constructor() {
        super();
    }
    shouldComponentUpdate(props) {
        return props.user != this.props.user;
    }
    preview = (e) => {
        var { user } = this.props;
        wx.previewImage({
            current: user.headimgurl,
            urls: [user.headimgurl]
        });
    }
    render() {
        var { user } = this.props;
        return (
            <div>
                <div styleName='avatar-container'>
                    <img styleName='avatar' src={user.headimgurl} onClick={this.preview} />
                </div>
                <div styleName='nickname'>
                    {user.nickname}
                </div>
            </div>
        );
    }
}

export default CSSModules(UserInfo, styles);
