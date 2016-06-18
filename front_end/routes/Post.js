import React from 'react'
import { findDOMNode } from 'react-dom'
import update from '../utility/update';
import showProgress from '../utility/show_progress';
import PostCardInDetail from './components/PostCardInDetail';
import Comment from './components/Comment';
import Loader from './components/Loader';
import Recorder from './components/Recorder';
import qs from 'querystring';
import classNames from 'classnames';
import { connect } from 'react-redux';
import * as actions from '../actions';
import _ from 'underscore';

// TODO: 详情页的404状态
// TODO: 评论被删除后的占位
class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = { record: false };
        this.new_id = props.params.new_id;
    }
    componentDidMount() {
        var { params } = this.props;
        update('/api/update_post_detail?_id=' + params.id);
        window.setTitle('详情');
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
        this.input.focus();
        this.setState({
            reply_comment,
            reply_user
        });
        const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
        const isIPhone = userAgent.match(/iPhone/i);
        if (!isIPhone) {
            dom.scrollIntoViewIfNeeded();
            this.scrollToViewPortBottom(dom);
        }
    }
    handleChange = (event) => {
        if (event.target.value.length <= 40) {
            this.setState({input: event.target.value});
        } else {
            var { reply_user } = this.props;
            var txt = `${reply_user ? '评论' : '回复'}不能超过40字`;
            PopupHelper.toast(txt);
        }
    }
    toggleRecord = () => {
        this.setState({
            record: !this.state.record
        });
    }
    like = (e) => {
        var { post, dispatch } = this.props;
        dispatch(actions.like(post._id));
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
        var { post, user, users, comments, comments_top } = this.props;
        var { record, err } = this.state;
        // TODO: 图片的显示有问题
        // TODO: 记录进入详情页的次数？
        return (
            <div className='post' onClick={this.clear_reply}>
                { post && <PostCardInDetail post={post} user={user} /> }
                { comments_top.length > 0 &&
                    <div className='comments'>
                        <div className='comments-header'>
                            <span className='ym'/>物主参与的互动
                        </div>
                        { comments_top.map(this.renderComment) }
                    </div>
                }
                { comments.length > 0 &&
                    <div className='comments'>
                        <div className='comments-header'>
                            <span className='ym'/>{comments_top.length > 0 ? '其它评论' : '评论'}
                        </div>
                        { comments.map(this.renderComment) }
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
        var show_record_btn = post.user_id == window.user_id;
        var me_like = post.me_like;
        var btn_cnt = show_record_btn ? 2 : 1;
        var placeholder = (user ? ('回复' + user.nickname) : '请输入评论')
            + '（不超过40字）';
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
                    <div className={`btn ${me_like ? 'image-btn_keyboard_praise_HL' : 'image-btn_keyboard_praise'}`}
                        onClick={this.like}/>
                    { show_record_btn && <div className={`btn ${record ? 'image-btn_keyboard' : 'image-btn_speech'}`}
                        onClick={this.toggleRecord}/> }
                    <div className={`send ${disable_send ? 'send-disable' : ''}`} onClick={this.send}>发送</div>
                    <div className={`input with${btn_cnt}`}>
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

// TODO: 这里要用reselect机制做一些缓存
export default connect((state, props) => {
    var users = state.users;
    var post = state.posts[props.params.id];
    var user = post && users[post.user_id];
    var post_detail = state.post_details[props.params.id];
    var comments_top = [];
    var comments = [];
    post && post_detail && post_detail.comments && post_detail.comments.map(comment => {
        if (comment.status == 1 || comment.replies.length > 0) {
            var user_ids = [comment.user_id, ...comment.replies.map(reply=>reply.user_id)];
            if (user_ids.indexOf(post.user_id) >= 0)
                comments_top.push(comment);
            else
                comments.push(comment);
        }
    });
    return {
        post, user, users, comments_top, comments
    };
})(Post);
