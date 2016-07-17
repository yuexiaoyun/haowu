import React from 'react'

import PopupHelper from '../../utility/PopupHelper';

import styles from './FollowLine.css'
import CSSModules from 'react-css-modules';

import qrcode from '../../files/qrcode.jpg';

import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

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
    close = (e) => {
        e.stopPropagation();
        this.props.dispatch(createAction('update_close_clicked')(1));
    }
    render() {
        var { close_clicked } = this.props;
        if (!close_clicked) {
            return (
                <div styleName='root' onClick={this.popup}>
                    <div styleName='qrcode'/>
                    <div styleName='close' onClick={this.close}/>
                    <div>点击识别二维码 关注“物记”</div>
                    <div>才能收到互动回复通知</div>
                </div>
            );
        } else {
            return null;
        }
    }
}

var mapStateToProps = (state) => {
    return {
        close_clicked: state.close_clicked
    }
}
export default connect(mapStateToProps)(
    CSSModules(FollowLine, styles)
);
