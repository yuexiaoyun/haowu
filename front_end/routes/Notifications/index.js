import React from 'react';
import setShareInfo from '../../utility/set_share_info';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import update from '../../utility/update';
import fconf from '../../fconf';

import NotificationCard from './NotificationCard'


class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        update('/api/update_notifications', data => {
            console.log(data);
            this.setState({
                clear_badge: data.clear_badge
            });
        });
        this.props.dispatch(createAction('update_badge')(0));
        window.setTitle('消息');
        setShareInfo();
    }
    render() {
        var { notifications } = this.props;
        var { clear_badge } = this.state;
        return (
            <div>
                { notifications && notifications.map((n) => {
                    var new_item = clear_badge && n.uptime > clear_badge;
                    return <NotificationCard key={n._id} notification={n} new_item={new_item} />;
                })}
            </div>
        );
    }
}

export default connect(state => ({
    notifications: state.notifications,
    notification_end: state.notification_end
}))(Notifications);
