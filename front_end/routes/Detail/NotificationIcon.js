import React from 'react'
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';

import btnMessageMe from '../../files/btn_message_me.png';

import styles from './NotificationIcon.css'
import CSSModules from 'react-css-modules';

class NotificationIcon extends React.Component {
    go = () => {
        hashHistory.push('/me/notifications');
    }
    render() {
        var { badge } = this.props;
        return (
            <div styleName='root' onClick={this.go}>
                <img styleName='icon' src={btnMessageMe} />
                { badge > 0 && <span styleName='badge'>{badge}</span> }
            </div>
        )
    }
}

var mapStateToProps = state=>{
    return {
        badge: state.badge
    }
}

export default connect(mapStateToProps)(
    CSSModules(NotificationIcon, styles)
);
