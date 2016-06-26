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
    viewSubList = () => {
        hashHistory.push('/me_sub_list');
    }
    render() {
        var { user } = this.props;
        return (
            <div>
                <div styleName='avatar-container'>
                    <img styleName='avatar' src={user.headimgurl} onClick={this.preview} />
                    { (user.sex == 1 || user.sex == 2) &&
                        <span
                            styleName='gender'
                            className={user.sex==1 ? 'image-icon_male': 'image-icon_female'}/>
                    }
                </div>
                <div styleName='nickname'>
                    {user.nickname}
                </div>
                <div styleName='reads' className='image-icon_me_fatieshu'>
                    {user.post_count || 0}
                </div>
                <div styleName='reads' className='image-icon_home_listened'>
                    {user.reads_count || 0}
                </div>
            </div>
        );
    }
}

export default CSSModules(UserInfo, styles);
