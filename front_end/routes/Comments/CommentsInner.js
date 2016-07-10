import React from 'react'
import { findDOMNode } from 'react-dom'
import { hashHistory } from 'react-router'
import update from '../../utility/update';
import PopupHelper from '../../utility/PopupHelper';
import showProgress from '../../utility/show_progress';

import qs from 'querystring';
import classNames from 'classnames';
import * as actions from '../../actions';
import _ from 'underscore';
import fconf from '../../fconf';

import Comment from './Comment';
import Recorder from '../common/Recorder';

import btnKeyboard from '../../files/btn_keyboard.png'
import btnSpeech from '../../files/btn_speech.png'
import btnKeyboardHome from '../../files/btn_keyboard_home.png'

import styles from './CommentsInner.css'
import CSSModules from 'react-css-modules';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

class CommentsInner extends React.Component {
    constructor(props, context) {
        super();
        this.new_id = props.new_id;
        this.state = {
            reply_comment: props.reply_comment_id,
            reply_user: props.reply_user_id,
            record: false
        }
    }
    scrollToViewPortBottom = (elem) => {
        var defaultRect = {top: 0, left: 0};
        var rect = (elem.getBoundingClientRect && elem.getBoundingClientRect()) || defaultRect;
        var bottom = rect.top + elem.clientHeight;

        var viewTop = document.body.scrollTop;
        window.scrollTo(0, viewTop + bottom - window.innerHeight + this.refs.comment_input.clientHeight);
    }
    clear_reply = () => {
        if (!this.state.record && !this.input.value) {
            this.setState({
                reply_comment: null,
                reply_user: null
            });
        }
    }
    reply = (reply_comment, reply_user, dom) => {
        this.setState({
            reply_comment,
            reply_user
        });
        this.input.focus();
        const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
        const isIPhone = userAgent.match(/iPhone/i);
        if (!isIPhone) {
            setTimeout(()=>{
                dom.scrollIntoViewIfNeeded();
                this.scrollToViewPortBottom(dom);
            }, 300);
        }
    }
    handleChange = (event) => {
        if (event.target.value.length <= 140) {
            this.setState({input: event.target.value});
        } else {
            var { reply_user } = this.props;
            var txt = `${reply_user ? '评论' : '回复'}不能超过140字`;
            PopupHelper.toast(txt);
        }
    }
    toggleRecord = () => {
        this.setState({
            record: !this.state.record
        });
    }
    pub = (c) => {
        var { record, reply_user, reply_comment } = this.state;
        if (reply_user && reply_comment) {
            var url = '/api/pub_reply?' + qs.stringify({
                ...c,
                user_id: reply_user,
                comment_id: reply_comment
            });
        } else {
            var url = '/api/pub_comment?' + qs.stringify({
                ...c,
                post_id: this.props.post._id
            });
        }
        return update(url, (data) => {
            this.new_id = data.new_id;
        }).then(()=>{
            this.setState({
                input: '',
                record: false
            });
            if (record && this.refs.record) {
                this.refs.record.clear();
            }
        });
    }
    send = (e) => {
        e.stopPropagation();
        var { reply_user, reply_comment } = this.props;
        var { record, audio_id, d, input } = this.state;
        if (record) {
            if (!audio_id)
                return;
            var p = this.refs.recorder.upload_voice()
                .then((server_id) => {
                    this.pub({
                        audio_id: server_id,
                        d
                    })
                });
        } else {
            if (!input || input.length == 0)
                return;
            var p = this.pub({ text: input });
        }
        showProgress('发布中', p.catch(()=>PopupHelper.toast('发布失败')));
    }
    renderComment = (comment) => {
        return <Comment
            key={comment._id}
            post={this.props.post}
            comment={comment}
            new_id={this.new_id}
            reply={this.reply} />;
    }
    render() {
        var { post, post_detail, user, users, emptyView, edit_title, comments } = this.props;
        var { record, err } = this.state;
        return (
            <div onClick={this.clear_reply}>
                { comments.top.length > 0 &&
                    <div styleName='comments'>
                        <div styleName='comments-header'>
                            <span styleName='ym'/>物主参与的互动
                        </div>
                        { comments.top.map(this.renderComment) }
                    </div>
                }
                { comments.others.length > 0 &&
                    <div styleName='comments'>
                        <div styleName='comments-header'>
                            <span styleName='ym'/>{comments.top.length > 0 ? '其它评论' : '评论'}
                        </div>
                        { comments.others.map(this.renderComment) }
                    </div>
                }
                { post_detail && post_detail.comments.length == 0 && emptyView }
                { this.state.inputing != 1 &&
                    <div className={`${record?'comment-input-audio':'comment-input-text'}`} />}
                { post && edit_title != 1 && this.renderInput() }
            </div>
        )
    }
    renderInput() {
        var { post, users, feed_empty } = this.props;
        var { record, input, reply_user } = this.state;
        var user = users[reply_user];
        var me_like = post.me_like;
        var placeholder = (user
            ? ('回复' + user.nickname)
            : `${post.user_id==window.user_id ? '补充' : '问'}点什么吧~`);
        if (record)
            placeholder = `语音${user ? ('回复' + user.nickname) : '评论'}`;
        var disable_send = record ? !this.state.audio_id : !input;
        return (
            <div className={classNames({
                    'comment-input': true,
                    'comment-input-audio': record,
                    'comment-input-text': !record,
                    'comment-input-fixed': this.state.inputing != 1,
                    'comment-input-absolute': this.state.inputing == 1
                })}
                ref='comment_input'
                onClick={(e)=>e.stopPropagation()}>
                <div styleName='input-line' >
                    <img styleName='btn' src={btnKeyboardHome} onClick={()=>hashHistory.push('/home')}/>
                    <img styleName='btn' src={record ? btnKeyboard : btnSpeech} onClick={this.toggleRecord}/>
                    { feed_empty && <div styleName='new' /> }
                    <div className={`send ${disable_send ? 'send-disable' : ''}`} onClick={this.send}>发送</div>
                    <div className={`input`}>
                        <input
                            type="text"
                            value={record ? '' : input}
                            disabled={record}
                            onChange={this.handleChange}
                            ref={(i)=>{
                                if (i) {
                                    this.input = i;
                                    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
                                    const isIPhone = userAgent.match(/iPhone/i);
                                    if (isIPhone) {
                                        i.addEventListener('blur', ()=>{
                                            console.log('blur');
                                            this.setState({inputing: 0});
                                        });
                                        i.addEventListener('focus', ()=>{
                                            console.log('focus');
                                            this.setState({inputing: 1});
                                            setTimeout(()=>i.scrollIntoViewIfNeeded(), 0);
                                        });
                                    }
                                } else {
                                }
                            }}
                            placeholder={placeholder} />
                    </div>
                </div>
                { record && <Recorder ref='recorder' onData={data=>{
                    this.setState(data)
                }} /> }
            </div>
        )
    }
}

var get_users = state => state.users;
var get_comments = (state, props) => {
    var { post, post_detail } = props;
    var top = [];
    var others = [];
    if (post && post_detail && post_detail.comments) {
        post_detail.comments.map(comment => {
            if (comment.status == 1 || comment.replies.length > 0) {
                var user_ids = [comment.user_id, ...comment.replies.map(reply=>reply.user_id)];
                if (user_ids.indexOf(post.user_id) >= 0)
                    top.push(comment);
                else
                    others.push(comment);
            }
        });
    }
    return { top, others }
}

var get_new = state => state.feed_ids.length == 0;
var mapStateToProps = createStructuredSelector({
    users: get_users,
    comments: get_comments,
    feed_empty: get_new
});
export default connect(mapStateToProps)(
    CSSModules(CommentsInner, styles)
);
