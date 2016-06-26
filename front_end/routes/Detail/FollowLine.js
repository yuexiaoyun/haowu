import React from 'react'

import styles from './FollowLine.css'
import CSSModules from 'react-css-modules';

// TODO: 关注公众号的弹窗
class FollowLine extends React.Component {
    shouldComponentUpdate(props) {
        return false;
    }
    render() {
        return (
            <div styleName='root'>
                <div>点击识别二维码，关注“物记”公众号</div>
                <div>朋友互动不遗漏</div>
            </div>
        );
    }
}
export default CSSModules(FollowLine, styles);
