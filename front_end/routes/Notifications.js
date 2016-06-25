import React from 'react';
import AudioPlayer from './components/AudioPlayer';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import update from '../utility/update';
import fconf from '../fconf';

class _NotificationCard extends React.Component {
    renderLike = ()=>{
        var { user, post } = this.props;
        var like_count = (post.me_like ? 1: 0) + post.others_like_count;
        return (
            <div className="list-item-content">
                <div className='nickname'>{user.nickname}</div>
                <span className='comment-text'>{like_count > 1 && `等${like_count}人`}赞了你</span>
            </div>
        );
    }
    renderRead = ()=>{
        var { user, post, audio } = this.props;
        var read_count = audio && ((audio.me_read ? 1: 0) + audio.others_read_count) || 0;
        return (
            <div className="list-item-content">
                <div className='nickname'>{user.nickname}</div>
                <span className='comment-text'>{read_count > 1 && `等${read_count}人`}听了你</span>
            </div>
        );
    }
    renderSub = ()=>{
        var { user } = this.props;
        return (
            <div className="list-item-content">
                <div className='nickname'>{user.nickname}</div>
                <span className='comment-text'>订阅了你</span>
            </div>
        );
    }
    renderCommentReply = ()=>{
        var { user, notification } = this.props;
        var action = {
            comment: '评论',
            reply: '回复'
        }[notification.type] || '';
        return (
            <div className="list-item-content">
                <div className='nickname'>{user.nickname}{action}了你</div>
                { notification.audio_id && <AudioPlayer audio_id={notification.audio_id} length={notification.d} /> }
                { notification.text && notification.text != '' && <span className='comment-text'>
                    {notification.text}
                </span>}
            </div>
        );
    }
    renderContent() {
        return ({
            like: this.renderLike,
            sub: this.renderSub,
            read: this.renderRead
        }[this.props.notification.type] || this.renderCommentReply)();
    }
    render() {
        var { user, notification, post, new_item } = this.props;
        var url = post ? ('/post/' + post._id) : null;
        if (notification.type == 'reply')
            url += `/${notification.reply_id}`;
        else if(notification.type == 'comment')
            url += `/${notification.comment_id}`;
        else if(notification.type == 'sub')
            url = '/sub_list';

        return (
            <div className={`list-item${new_item ? ' new_item' : ''}`} onClick={url ? ()=>hashHistory.push(url) : null}>
                <div className='avatar-container'>
                    <img className='avatar' src={user.headimgurl} onClick={(e)=>{
                        e.stopPropagation();
                        hashHistory.push('detail/' + notification.user_id2);
                    }} />
                </div>
                { post && post.pic_id && <img className='picture' src={fconf.qiniu.site + post.pic_id + '-c167'} />}
                { this.renderContent() }
            </div>
        );
    }
}

var NotificationCard = connect((state, props)=>{
    var user = state.users[props.notification.user_id2];
    var post = state.posts[props.notification.target];
    var audio = post && state.audios[post.audio_id];
    return {
        user, post, audio
    };
})(_NotificationCard);

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
