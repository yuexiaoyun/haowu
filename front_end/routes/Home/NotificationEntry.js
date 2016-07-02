import React from 'react'
import { hashHistory } from 'react-router'
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import styles from './NotificationEntry.css';
import CSSModules from 'react-css-modules';

class NotificationEntry extends React.Component {
    onClick = ()=>{
        hashHistory.push('/me/notifications');
    }
    render() {
        var { badge, user } = this.props;
        return (
            <div styleName='root' onClick={this.onClick}>
                <img styleName='avatar' src={user.headimgurl} />
                <span styleName='text'>
                    {badge.count}条新消息
                </span>
            </div>
        );
    }
}

var get_badge = state => state.badge;
var get_users = state => state.users;

var get_user = createSelector(
    [get_badge, get_users],
    (badge, users) => users[badge.uid]
);

var mapStateToProps = createStructuredSelector({
    badge: get_badge,
    user: get_user
});

export default connect(mapStateToProps)(
    CSSModules(NotificationEntry, styles)
);
