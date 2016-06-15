import React from 'react'
import { findDOMNode } from 'react-dom'
import Helmet from 'react-helmet'
import PostCard from './components/PostCard'
import screenSize from '../utility/screen_size';
import showProgress from '../utility/show_progress';
import update from '../utility/update';
import CssButton from './components/CssButton';
import Recorder from './components/Recorder';
import AudioPlayer from './components/AudioPlayer';
import Loader from './components/Loader';
import fconf from '../fconf';
import * as actions from '../actions';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions'
import { fromObjectId } from '../utility/format_time';
import { parse_online_json } from '../utility/fetch_utils';
import { play, stop } from '../utility/audio_manager';
import { sub } from '../actions';
import PopupHelper from '../utility/PopupHelper';
import _ from 'underscore';
import qs from 'querystring';

// TODO: 对评论和回复内容的Server端验证
// TODO: 相对时间的重刷
var UserCard = ({user, onClick, louzhu, _id}) => {
    var avatarClick = (e)=>{
        hashHistory.push('detail/' + user._id);
    }
    return (
        <div className="user-line" onClick={onClick || avatarClick}>
            <img className='avatar' src={user.headimgurl}  onClick={avatarClick}/>
            <div className='nickname'>{user.nickname} { louzhu && <span className='louzhu'>物主</span> }</div>
            <div className='text-secondary'>{ fromObjectId(_id) }</div>
        </div>
    );
};

// TODO: 微信昵称重名问题
var NameSpan = ({user}) => {
    var avatarClick = (e)=>{
        e.stopPropagation();
        hashHistory.push('detail/' + user._id);
    }
    return <span className={'nickname'} onClick={avatarClick}><strong>{user.nickname}</strong></span>;
};

class Reply extends React.Component {
    componentDidMount() {
        if (this.props.new_id == this.props.reply._id) {
            var dom = findDOMNode(this);
            dom.scrollIntoViewIfNeeded(true);
        }
    }
    onClick = (e) => {
        var { reply, onClick } = this.props;
        if (reply.user_id == window.user_id) {
            /*
            if (confirm('你确认删除您发布的这条回复么？')) {
                showProgress('删除中', update('/api/delete_reply?_id=' + reply._id)
                    .catch(()=>PopupHelper.toast('删除失败')));
            }
            */
        } else {
            onClick(reply.user_id)(e);
        }
    }
    render() {
        try {
            var { reply, users } = this.props;
            return (
                <div className="reply-text" onClick={this.onClick}>
                    <NameSpan user={users[reply.user_id]} />{' 回复 '}<NameSpan user={users[reply.user_id2]} />：
                    {reply.audio_id ? <AudioPlayer key={reply.audio_id} audio_id={reply.audio_id} length={reply.d}/>: reply.text}
                </div>
            );
        } catch(err) {
            alert(err);
        }
    }
}

class Comment extends React.Component {
    componentDidMount() {
        if (this.props.new_id == this.props.comment._id) {
            var dom = findDOMNode(this);
            dom.scrollIntoViewIfNeeded(true);
        }
    }
    onClick = (e) => {
        var { comment, onClick } = this.props;
        if (comment.user_id == window.user_id) {
            /*
            if (confirm('你确认删除您发布的这条评论么？')) {
                showProgress('删除中', update('/api/delete_comment?_id=' + comment._id)
                    .catch(()=>PopupHelper.toast('删除失败')));
            }
            */
        } else {
            onClick(comment.user_id)(e);
        }
    }
    render() {
        try {
            var { comment, louzhu, onClick, new_id, users } = this.props;
            return (
                <div className='comment'>
                    <UserCard _id={comment._id} louzhu={louzhu} user={users[comment.user_id]} onClick={this.onClick}/>
                    { comment.status == 1 && <div className='comment-text' onClick={this.onClick}>
                        {comment.audio_id
                            ? <AudioPlayer key={comment.audio_id} audio_id={comment.audio_id} length={comment.d}/>
                            : comment.text}
                    </div> }
                    { comment.status == 0 && <div className='comment-text comment-text-deleted'>
                        该评论已删除
                    </div> }
                    { comment.replies.length > 0 && <div className='replies'>
                        { comment.replies.map((reply)=>(
                            <Reply key={reply._id} new_id={new_id} reply={reply} users={users} onClick={onClick} active={true}/>
                        )) }
                    </div>}
                </div>
            );
        } catch(err) {
            alert(err);
        }
    }
};

// TODO: 详情页的404状态
// TODO: 评论被删除后的占位
class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = { record: false };
        this.new_id = props.params.new_id;
    }
    preview = (e) => {
        var { post } = this.props;
        wx.previewImage({
            current: fconf.qiniu.site + post.pic_id,
            urls: [fconf.qiniu.site + post.pic_id]
        });
    }
    like = (e) => {
        var { post, dispatch } = this.props;
        dispatch(actions.like(post._id));
    }
    more = (e) => {
        e.stopPropagation();
        var { post, user } = this.props;
        if (window.user_id == post.user_id) {
            PopupHelper.menu([{
                text: '删除',
                f: this.deletePost
            }]);
        } else {
            var text = user.subbed ? '取消订阅' : '订阅';
            PopupHelper.menu([{
                text,
                f: ()=>{
                    this.props.dispatch(sub({
                        user_id: post.user_id,
                        sub: user.subbed ? 0 : 1
                    }));
                }
            }]);
        }
    }
    deletePost = () => {
        PopupHelper.confirm('您确认要删除么', '删除', ()=>{
            var { post } = this.props;
            var url = '/api/delete_post?' + qs.stringify({
                _id: post._id
            });
            update(url)
                .then(()=>{
                    PopupHelper.toast('删除成功');
                    hashHistory.go(-1);
                })
                .catch((err)=>{
                    PopupHelper.toast('删除失败');
                });
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
                record: false,
                reply_user: null,
                reply_comment: null
            });
            if (record && this.refs.record) {
                this.refs.record.clear();
            }
        });
    }
    send = (e) => {
        e.stopPropagation();
        try {
            var { record, audio_id, d, reply_user, reply_comment, input } = this.state;
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
            showProgress('发布中', p)
                .catch(()=>PopupHelper.toast('发布失败'));
        } catch(err) {
        }
    }
    componentDidMount() {
        var { params } = this.props;
        update('/api/update_post_detail?_id=' + params.id);
    }
    clear_reply = () => {
        if (!this.refs.input.value && !this.state.record) {
            this.setState({
                reply_comment: null,
                reply_user: null
            });
        }
    }
    toggleRecord = () => {
        this.setState({
            record: !this.state.record
        });
    }
    onClick = (comment_id)=>(user_id)=>(e)=>{
        e.stopPropagation();
        this.refs.input.focus();
        this.setState({
            reply_comment: comment_id,
            reply_user: user_id
        });
    }
    renderComment = (comment) => {
        return <Comment
            key={comment._id}
            new_id={this.new_id}
            users={this.props.users}
            comment={comment}
            louzhu={this.props.post && comment.user_id==this.props.post.user_id}
            onClick={this.onClick(comment._id)} />;
    }
    play = () => {
        var { post, playing, loading } = this.props;
        if (post) {
            if (playing || loading)
                stop(post.audio_id);
            else
                play(post.audio_id);
        }
    }
    componentWillUnmount() {
        var { post, playing, loading } = this.props;
        if (post) {
            if (playing || loading)
                stop(post.audio_id);
        }
    }
    render() {
        var { post, user, users, comments, comments_top, like_count, read_count, playing, loading, time } = this.props;
        var { record, err } = this.state;
        var d = post && Math.floor((post.length + 500) / 1000) || 0;
        // TODO: 图片的显示有问题
        // TODO: 记录进入详情页的次数？
        return (
            <div className='post' onClick={this.clear_reply}>
                <Helmet title={'详情'} />
                { post && <div className="picture image-icon_image_loading"
                    style={{
                        height: screenSize().width,
                    }}>
                    <img src={fconf.qiniu.site + post.pic_id + '-c720'}
                        style={post.w > post.h ? {height: '100%'} : {width: '100%'}}
                        onClick={this.preview}/>
                </div> }
                { post && <div className='audio-line'>
                    <div className='audio-line-tab'>
                        <span className='pull-right btn-default'
                            onClick={()=>(like_count > 0 && hashHistory.push('/like_list/'+post._id))}>
                            { like_count }人赞过
                        </span>
                    </div>
                    <div className='audio-line-tab'>
                        <div
                            onClick={this.play}
                            className={`lzw ${(playing || loading) ? 'image-btn_play_stop' : 'image-btn_play_start'}`} />
                    </div>
                    <div className='audio-line-tab'>
                        <span className='pull-left btn-default clearfix'
                            onClick={()=>(read_count > 0 && hashHistory.push('/read_list/'+post.audio_id))}>
                            { read_count }人听过
                        </span>
                    </div>
                </div> }
                { post && <div className='audio-length'>
                    {loading ? <Loader no_text={true} />: `${playing ? time : d}"`}
                </div> }
                { post && <div className="author-line" onClick={()=>hashHistory.push('/detail/' + user._id)}>
                    <img className='avatar' src={user.headimgurl} />
                    <div className='delete image-btn_more' onClick={this.more}/>
                    <span className='nickname'>{user.nickname}</span>
                    <span className='text-secondary'>{ fromObjectId(post._id) }发布</span>
                </div> }
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
                <div className={`${record?'comment-input-audio':'comment-input-text'}`} />
                { this.renderInput() }
            </div>
        )
    }
    handleChange = (event) => {
        if (event.target.value.length <= 40) {
            this.setState({input: event.target.value});
        } else {
            var { reply_user } = this.state;
            var txt = `${reply_user ? '评论' : '回复'}不能超过40字`;
            PopupHelper.toast(txt);
        }
    }
    // TODO input
    renderInput() {
        var { post, user, users } = this.props;
        var { record, err, reply_user, input } = this.state;
        var show_record_btn = post && post.user_id == window.user_id;
        var me_like = post && post.me_like;
        var btn_cnt = show_record_btn ? 2 : 1;
        var placeholder = (reply_user ? ('回复' + users[reply_user].nickname) : '请输入评论')
            + '（不超过40字）';
        if (record)
            placeholder = `语音${reply_user ? ('回复' + users[reply_user].nickname) : '评论'}`;
        var disable_send = record ? !this.state.audio_id : !input;
        return (
            <div className={`comment-input ${record?'comment-input-audio':'comment-input-text'}`}
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
                            ref="input"
                            value={record ? '' : input}
                            disabled={record}
                            onChange={this.handleChange}
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
    var like_count = post ? (post.others_like_count + post.me_like) : 0;
    var me_read = post && state.reads.has(post.audio_id);
    var read_count = post_detail ? (post_detail.others_read_count + (me_read ? 1 : 0)) : 0;
    var { id, play_state, time } = state.audio_player;
    var playing = (post && id == post.audio_id && play_state == 'playing');
    var loading = (post && id == post.audio_id && play_state == 'loading');
    time = Math.floor(time / 1000 + 0.5);
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
        post, user, users, comments_top, comments, like_count, read_count, playing, loading, time
    };
})(Post);
