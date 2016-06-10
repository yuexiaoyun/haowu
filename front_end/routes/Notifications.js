import React from 'react';
import CommonCard from './components/CommonCard';
import AudioPlayer from './components/AudioPlayer';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { hashHistory } from 'react-router';
import { get_badge_count } from '../reselectors';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        // componentDidMount后会clear_badge，但本次渲染仍然需要上一次的clear_badge_time
        this.state = {
            clear_badge_time: props.clear_badge_time
        }
    }
    componentDidMount() {
        fetch('/api/clear_badge', {credentials:'same-origin'});
        this.props.dispatch(createAction('clear_badge_time')(new Date()));
    }
    render() {
        var { notifications, users } = this.props;
        var { clear_badge_time } = this.state;
        return <div>{ notifications && notifications.map(
            (n) => {
                var user = users[n.openid2];
                var action = {
                    like: '赞',
                    sub: '订阅',
                    comment: '评论',
                    reply: '回复'
                }[n.type] || '';
                var url = n.post ? ('/post/' + n.post._id) : null;
                if (n.type == 'reply')
                    url += `/${n.reply_id}`;
                else if(n.type == 'comment')
                    url += `/${n.comment_id}`;
                return <CommonCard
                    key={n._id}
                    openid={n.openid2}
                    avatar={user.headimgurl}
                    txt={`${user.nickname} ${action}了你`}
                    pic_id={n.post ? n.post.pic_id : null}
                    new_item={!clear_badge_time || n.uptime > clear_badge_time}
                    onClick={url ? ()=>{hashHistory.push(url)} : null}
                >
                    { n.audio_id && <AudioPlayer audio_id={n.audio_id} length={n.d} /> }
                    { n.text && n.text != '' && <span style={styles.text}>{n.text}</span>}
                </CommonCard>;
            }
        )}</div>;
    }
}
var styles = {
    text: {
        color: '#666666',
        fontSize: 14,
        lineHeight: '16px'
    }
}
export default connect(state=>({
    users: state.users,
    clear_badge_time: state.clear_badge_time,
    notifications: state.notifications
}))(Notifications);
