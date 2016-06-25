import React from 'react';
import CommonCard from './components/CommonCard';
import AudioPlayer from './components/AudioPlayer';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { hashHistory } from 'react-router';
import update from '../utility/update';

class _NotificationCard extends React.Component {
    render() {
        var { user, notification, post, new_item } = this.props;
        var action = {
            like: '赞',
            sub: '订阅',
            comment: '评论',
            reply: '回复'
        }[notification.type] || '';
        var url = post ? ('/post/' + post._id) : null;
        if (notification.type == 'reply')
            url += `/${notification.reply_id}`;
        else if(notification.type == 'comment')
            url += `/${notification.comment_id}`;
        return (
            <CommonCard
                user_id={notification.user_id2}
                avatar={user.headimgurl}
                txt={`${user.nickname} ${action}了你`}
                pic_id={post ? post.pic_id : null}
                new_item={new_item}
                onClick={url ? ()=>{hashHistory.push(url)} : null}
            >
                { notification.audio_id && <AudioPlayer audio_id={notification.audio_id} length={notification.d} /> }
                { notification.text && notification.text != '' && <span className='comment-text'>
                    {notification.text}
                </span>}
            </CommonCard>
        );
    }
}

var NotificationCard = connect((state, props)=>({
    user: state.users[props.notification.user_id2],
    post: state.posts[props.notification.target]
}))(_NotificationCard);

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        update('/api/update_notifications', ({clear_badge_time}) => {
            this.setState({clear_badge_time});
        });
    }
    render() {
        var { notifications } = this.props;
        var { clear_badge_time } = this.state;
        return (
            <div>
                { notifications && notifications.map((n) => {
                    var new_item = clear_badge_time && n.uptime > clear_badge_time;
                    return <NotificationCard key={n._id} notification={n} new_item={new_item} />;
                })}
            </div>
        );
    }
}

export default connect(state => ({
    notifications: state.notifications
}))(Notifications);
