import React from 'react';
import AudioPlayer from '../common/AudioPlayer';
import { hashHistory } from 'react-router';
import { createAction } from 'redux-actions';
import fconf from '../../fconf';
import qs from 'querystring';

import styles from './NotificationCard.css';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

class NotificationCard extends React.Component {
    renderLike = ()=>{
        var { user, post } = this.props;
        var like_count = post.like_count;
        return (
            <div styleName="list-item-content">
                <div styleName='nickname'>{user.nickname}</div>
                <span styleName='comment-text'>{like_count > 1 && `等${like_count}人`}赞了你</span>
            </div>
        );
    }
    renderRead = ()=>{
        var { user, post, audio } = this.props;
        var read_count = audio && audio.read_count || 0;
        return (
            <div styleName="list-item-content">
                <div styleName='nickname'>{user.nickname}</div>
                <span styleName='comment-text'>{read_count > 1 && `等${read_count}人`}听了你</span>
            </div>
        );
    }
    renderSub = ()=>{
        var { user, me } = this.props;
        return (
            <div styleName="list-item-content">
                <div styleName='nickname'>{user.nickname}</div>
                <span styleName='comment-text'>{me.subbed_count > 1 && `等${me.subbed_count}人`}订阅了你</span>
            </div>
        );
    }
    renderPub = ()=>{
        var { user } = this.props;
        return (
            <div styleName="list-item-content">
                <div styleName='nickname'>{user.nickname}</div>
                <span styleName='comment-text'>更新了好物</span>
            </div>
        );
    }
    renderCommentReply = ()=>{
        var { user, notification, post } = this.props;
        if (notification.type == 'reply') {
            var action = '回复了你';
        } else if (post.user_id == window.user_id) {
            var action = '评论了你';
        } else if (post.user_id == user._id) {
            var action = '补充了评论';
        } else {
            var action = '参与了评论';
        }
        return (
            <div styleName="list-item-content">
                <div styleName='nickname'>{user.nickname}{action}</div>
                { notification.audio_id && <AudioPlayer audio_id={notification.audio_id} length={notification.d} /> }
                { notification.text && notification.text != '' && <span styleName='comment-text'>
                    {notification.text}
                </span>}
            </div>
        );
    }
    renderContent() {
        return ({
            like: this.renderLike,
            sub: this.renderSub,
            read: this.renderRead,
            pub: this.renderPub
        }[this.props.notification.type] || this.renderCommentReply)();
    }
    render() {
        var { user, notification, post, new_item } = this.props;
        var url = post ? ('/post/' + post._id) : null;
        if (notification.type == 'reply' || notification.type == 'comment') {
            url += '?' + qs.stringify({
                comment_id: notification.comment_id,
                reply_id: notification.reply_id,
                user_id: notification.user_id2
            });
        }
        else if(notification.type == 'sub')
            url = '/subbed_list/' + window.user_id;

        return (
            <div className={`list-item${new_item ? ' new_item' : ''}`} onClick={url ? ()=>hashHistory.push(url) : null}>
                <div styleName='avatar-container'>
                    <img styleName='avatar' src={user.headimgurl} onClick={(e)=>{
                        e.stopPropagation();
                        hashHistory.push('detail/' + notification.user_id2);
                    }} />
                </div>
                { post && post.pic_id && <img styleName='picture' src={fconf.qiniu.site + post.pic_id + '-b80'} />}
                { this.renderContent() }
            </div>
        );
    }
}

var get_audios = state => state.audios;
var get_me = state => state.users[window.user_id];
var get_user = (state, props) => state.users[props.notification.user_id2];
var get_post = (state, props) => state.posts[props.notification.target];

var makeMapStateToProps = ()=>{
    return createSelector(
        [get_user, get_post, get_audios, get_me],
        (user, post, audios, me) => {
            var audio = post && audios[post.audio_id];
            return {
                user, post, audio, me
            };
        }
    );
};

export default connect(makeMapStateToProps)(
    CSSModules(NotificationCard, styles)
);
