import React from 'react'
import { findDOMNode } from 'react-dom'
import update from '../utility/update';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';
import TopCard from './Post/TopCard';
import Comment from './components/Comment';
import Loader from './components/Loader';
import Recorder from './components/Recorder';
import qs from 'querystring';
import classNames from 'classnames';
import { connect } from 'react-redux';
import setShareInfo from '../utility/set_share_info';
import * as actions from '../actions';
import { get_users } from '../reselectors';
import { createSelector, createStructuredSelector } from 'reselect';
import _ from 'underscore';
import fconf from '../fconf';

class Post extends React.Component {
    constructor(props) {
        super(props);
        var { query } = props.location;
        if (query) {
            this.new_id = query.reply_id || query.comment_id;
            this.state = {
                reply_comment: query.comment_id,
                reply_user: query.user_id
            }
        } else {
            this.state = { record: false };
        }
    }
    componentDidMount() {
        var { params } = this.props;
        update('/api/update_post_detail?_id=' + params.id);
        window.setTitle('详情');
        this.setShareInfo();
    }
    componentDidUpdate() {
        this.setShareInfo();
    }
    setShareInfo = () => {
        var { post, user } = this.props;
        if (post && user) {
            var link = fconf.site + '/app/post/' + post._id;
            console.log(link);
            setShareInfo({
                title: user.nickname + '分享了一件好物',
                link,
                desc: '物记，好物有声',
                imgUrl: fconf.qiniu.site + post.pic_id + '-c167'
            });
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
        var { post, user, users, comments } = this.props;
        var { record, err } = this.state;
        return (
            <div className='post' onClick={this.clear_reply}>
                { post && <TopCard post={post} user={user} /> }
                { comments.top.length > 0 &&
                    <div className='comments'>
                        <div className='comments-header'>
                            <span className='ym'/>物主参与的互动
                        </div>
                        { comments.top.map(this.renderComment) }
                    </div>
                }
                { comments.others.length > 0 &&
                    <div className='comments'>
                        <div className='comments-header'>
                            <span className='ym'/>{comments.top.length > 0 ? '其它评论' : '评论'}
                        </div>
                        { comments.others.map(this.renderComment) }
                    </div>
                }
                { this.state.inputing != 1 &&
                    <div className={`${record?'comment-input-audio':'comment-input-text'}`} />}
                { post && this.renderInput() }
            </div>
        )
    }
    renderInput() {
        var { post, users } = this.props;
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
                <div className='input-line' >
                    <div className={`btn ${record ? 'image-btn_keyboard' : 'image-btn_speech'}`}
                        onClick={this.toggleRecord}/>
                    <div className={`send ${disable_send ? 'send-disable' : ''}`} onClick={this.send}>发送</div>
                    <div className={`input with1`}>
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

var get_post = (state, props) => state.posts[props.params.id];
var get_post_detail = (state, props) => state.post_details[props.params.id];
var get_user = createSelector(
    [get_post, get_users],
    (post, users) => post && users[post.user_id]
);
var get_comments = createSelector(
    [get_post, get_post_detail],
    (post, post_detail) => {
        var top = [];
        var others = [];
        post && post_detail && post_detail.comments && post_detail.comments.map(comment => {
            if (comment.status == 1 || comment.replies.length > 0) {
                var user_ids = [comment.user_id, ...comment.replies.map(reply=>reply.user_id)];
                if (user_ids.indexOf(post.user_id) >= 0)
                    top.push(comment);
                else
                    others.push(comment);
            }
        });
        return { top, others }
    }
)

var mapStateToProps = createStructuredSelector({
    post: get_post,
    post_detail: get_post_detail,
    user: get_user,
    users: get_users,
    comments: get_comments
});

export default connect(mapStateToProps)(
    Post
);
