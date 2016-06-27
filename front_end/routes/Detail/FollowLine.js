import React from 'react'

import PopupHelper from '../../utility/PopupHelper';

import styles from './FollowLine.css'
import CSSModules from 'react-css-modules';

import qrcode from '../../files/qrcode.jpg';

class FollowLine extends React.Component {
    popup = () => {
        PopupHelper.popup(
            <div className='qr_dialog'>
                <img className='qrcode' src={qrcode}/>
                <div>长按识别图中二维码</div>
                <div>即可关注“物记”公众号</div>
            </div>
        );
    }
    shouldComponentUpdate(props) {
        return false;
    }
    render() {
        return (
            <div styleName='root' onClick={this.popup}>
                <img styleName='qrcode' src={qrcode}/>
                <div>点击识别二维码 关注“物记”</div>
                <div>才能收到互动回复通知</div>
            </div>
        );
    }
}
export default CSSModules(FollowLine, styles);
