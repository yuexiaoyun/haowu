import React from 'react';
import setShareInfo from '../../utility/set_share_info';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import update from '../../utility/update';
import fconf from '../../fconf';

import Loader from '../components/Loader';
import EmptyView from '../common/EmptyView';
import NotificationCard from './NotificationCard'
import InfiniteScroll from 'react-infinite-scroller';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.dispatch(createAction('update_badge')({
            count: 0,
            users: []
        }));
        window.setTitle('消息');
        setShareInfo();
    }
    loadMore = (page) => {
        var { notifications } = this.props;
        if (notifications.length == 0) {
            update('/api/update_notifications', data => {
                setTimeout(()=>{
                    this.setState({
                        clear_badge: data.clear_badge
                    });
                }, 0);
            });
        } else {
            update('/api/update_notifications?before_uptime=' + notifications[notifications.length - 1].uptime);
        }
    }
    render() {
        var { notifications, notification_end } = this.props;
        var { err, clear_badge } = this.state;
        if (notifications && notifications.length == 0 && notification_end == 1) {
            return <EmptyView emptyText='还没有任何互动消息哦~' />
        } else {
            return (
                <InfiniteScroll hasMore={notification_end == 0} loadMore={this.loadMore}>
                    { notifications && notifications.map((n) => {
                        var new_item = clear_badge && n.uptime > clear_badge;
                        return <NotificationCard key={n._id} notification={n} new_item={new_item} />;
                    })}
                    { notification_end == 0 && !err && <Loader /> }
                </InfiniteScroll>
            );
        }
    }
}

export default connect(state => ({
    notifications: state.notifications,
    notification_end: state.notification_end
}))(Notifications);
