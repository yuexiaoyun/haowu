import React from 'react'
import { hashHistory } from 'react-router';
import * as actions from '../../actions';

import { connect } from 'react-redux';
import styles from './SubButton.css'
import CSSModules from 'react-css-modules';

class SubButton extends React.Component {
    sub = () => {
        var { user, dispatch } = this.props;
        dispatch(actions.sub({
            sub: !user.subbed,
            user_id: user._id
        }));
    }
    viewSubList = () => {
        hashHistory.push('/me_sub_list');
    }
    render() {
        var { user } = this.props;
        if (user._id != window.user_id) {
            return (
                <span className='btn-default' styleName='root' onClick={this.sub}>
                    {user.subbed ? '已订阅' : '订阅'}
                </span>
            )
        } else if (user.me_subids && user.me_subids.length > 0) {
            return (
                <span className='btn-default' styleName='root' onClick={this.viewSubList}>
                    订阅{user.me_subids.length}人
                </span>
            )
        } else {
            return <span />
        }
    }
}

export default connect()(
    CSSModules(SubButton, styles)
);
