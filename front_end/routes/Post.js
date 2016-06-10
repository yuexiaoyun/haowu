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
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions'
import { fromObjectId } from '../utility/format_time';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import _ from 'underscore';
import qs from 'querystring';

// TODO: 相对时间的重刷
var UserCard = ({user, onClick, _id}) => {
    var avatarClick = (e)=>{
        hashHistory.push('detail/' + user.openid);
    }
    return (
        <div style={styles.d} onClick={onClick || avatarClick}>
            <img src={user.headimgurl} width="34" height="34" style={styles.avatar} onClick={avatarClick}/>
            <div>
                <div style={styles.name}><strong>{user.nickname}</strong></div>
                <div style={styles.time}>{ fromObjectId(_id) }</div>
            </div>
        </div>
    );
};

var NameSpan = ({user}) => {
    var avatarClick = (e)=>{
        e.stopPropagation();
        hashHistory.push('detail/' + user.openid);
    }
    return <span style={styles.name} onClick={avatarClick}><strong>{user.nickname}</strong></span>;
};

class Reply extends React.Component {
    componentDidMount() {
        if (this.props.new_id == this.props.reply._id) {
            var dom = findDOMNode(this);
            dom.scrollIntoViewIfNeeded(true);
        }
    }
    render() {
        try {
            var { reply, onClick, users } = this.props;
            return (
                <div style={styles.reply_text} onClick={onClick(reply.openid)}>
                    <NameSpan user={users[reply.openid]} />{' 回复 '}<NameSpan user={users[reply.openid2]} />：
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
    render() {
        try {
            var { comment, onClick, new_id, users } = this.props;
            return (
                <div style={styles.comment}>
                    <UserCard _id={comment._id} user={users[comment.openid]} onClick={onClick(comment.openid)}/>
                    <div style={styles.comment_text} onClick={onClick(comment.openid)}>
                        {comment.audio_id
                            ? <AudioPlayer key={comment.audio_id} audio_id={comment.audio_id} length={comment.d}/>
                            : comment.text}
                    </div>
                    { comment.replies.length > 0 && <div style={styles.replies}>
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
        dispatch(createAction('like')(post._id));
        var url = '/api/like?' + qs.stringify({
            _id: post._id
        });
        fetch(url, {credentials: 'same-origin'});
    }
    deletePost = (e) => {
        if (confirm('您确认要删除么？')) {
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
        }
    }
    pub = (c) => {
        var { record, reply_user, reply_comment } = this.state;
        if (reply_user && reply_comment) {
            var url = '/api/pub_reply?' + qs.stringify({
                ...c,
                openid: reply_user,
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
            this.refs.input.value = '';
            this.setState({
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
            var { record, audio_id, d, reply_user, reply_comment } = this.state;
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
                var text = this.refs.input.value;
                if (!text || text.length > 40)
                    return;
                var p = this.pub({ text });
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
    renderInput() {
        var { post, user, users } = this.props;
        var { record, err, reply_user } = this.state;
        var show_record_btn = post && post.openid == window.openid;
        var placeholder = reply_user ? ('回复' + users[reply_user].nickname) : '请输入评论';
        if (record)
            placeholder = `语音${reply_user ? ('回复' + users[reply_user].nickname) : '评论'}`;
        return (
            <div style={styles.input_d(record)} onClick={(e)=>e.stopPropagation()}>
                <div style={styles.input_text}>
                    { show_record_btn && <span style={styles.record_btn} onClick={this.toggleRecord}>
                        <CssButton
                            className={record ? 'image-btn_keyboard' : 'image-btn_speech'}
                            width={30}
                            height={30}
                        />
                    </span> }
                    <input
                        style={styles.input(show_record_btn)}
                        ref="input"
                        disabled={record}
                        placeholder={placeholder} />
                    <span style={styles.send} onClick={this.send}>发送</span>
                </div>
                { record && <Recorder ref='recorder' onData={data=>{
                    this.setState(data)
                }} /> }
            </div>
        )
    }
    render() {
        var { post, user, users, like_users, comments } = this.props;
        var { record, err } = this.state;
        var d = post && Math.floor((post.length + 500) / 1000) || 0;
        // TODO: 图片的显示有问题
        // TODO: 记录进入详情页的次数？
        return (
            <div style={styles.post} onClick={this.clear_reply}>
                <Helmet title={'发布详情'} />
                { user && <UserCard user={user} _id={post._id} /> }
                { post && <div className="card-content image-icon_image_loading"
                    style={{
                        height: screenSize().width,
                        backgroundColor: '#f8f8f8',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '24px 24px',
                        position: 'relative'
                    }}>
                    <img src={fconf.qiniu.site + post.pic_id}
                        className="bgTranslate2"
                        onClick={this.preview}/>
                </div> }
                { post && <div style={styles.d1}>
                    <div style={styles.d2}>
                        { d + '"' }
                    </div>
                    <div style={styles.d2}>
                        <CssButton
                        className='image-btn_play_start'
                        width={60}
                        height={60}/>
                    </div>
                    <div style={styles.d2}>
                        <span style={styles.reads}>{`${post.read_count}人听过`}</span>
                    </div>
                </div> }
                { !like_users && !err && <Loader /> }
                { post && like_users && <div style={styles.dd}>
                    <div style={styles.praise}>
                        <CssButton
                            className={"image-btn_detail_praise" +(post.me_like ? "_selected" : "")}
                            onClick={this.like}
                            width={40}
                            height={32}/>
                    </div>
                    { like_users.map(user => (<img
                        src={user.headimgurl}
                        onClick={(e)=>{
                            hashHistory.push('detail/' + user.openid)
                        }}
                        style={styles.like_user} />)) }
                    { post.openid == window.openid && <div style={styles.delete} onClick={this.deletePost}>
                        <CssButton
                            className={"image-btn_detail_delete"}
                            onClick={this.delete}
                            width={40}
                            height={32}/>
                    </div> }
                </div> }
                { comments && comments.map(comment=>{
                    var onClick = (openid)=>(e)=>{
                        e.stopPropagation();
                        this.refs.input.focus();
                        this.setState({
                            reply_comment: comment._id,
                            reply_user: openid
                        });
                    };
                    return <Comment key={comment._id} new_id={this.new_id} users={users} comment={comment} onClick={onClick} />;
                }) }
                <div style={{width: '100%', height: 48 + (record ? 132 : 0), clear:'both', overflow:'hidden'}} />
                { this.renderInput() }
            </div>
        )
    }
}

export default connect((state, props) => {
    var users = state.users;
    var post = state.posts[props.params.id];
    var user = post && users[post.openid];
    var post_detail = state.post_details[props.params.id];
    var like_users = (()=> {
        if (post && post_detail && post_detail.likes) {
            var likes = _.filter(post_detail.likes, id=>(id!=window.openid));
            if (post.me_like)
                likes = [window.openid, ...likes];
            return likes.map(id=>users[id]);
        }
        return null;
    })();
    var comments = post_detail && post_detail.comments;
    return {
        post, user, users, like_users, comments
    };
})(Post);

var styles = {
    post: {
        backgroundColor: '#ffffff'
    },
    replies: {
        marginLeft: 51,
        marginRight: 10,
        marginTop: 15,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: '#f1f1f1'
    },
    reply_text: {
        marginTop: 7,
        marginBottom: 7,
        fontSize: 14,
        lineHeight: '22px',
        color: '#000000'
    },
    comment: {
        marginTop: 20,
        marginBottom: 20
    },
    comment_text: {
        marginLeft: 57,
        fontSize: 14,
        color: '#000000'
    },
    d: {
        width: '100%',
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    dd: {
        paddingTop: 4,
        marginTop: 20,
        height: 52
    },
    praise: {
        float: 'left',
        height: 32,
        width: 48,
        paddingTop: 3,
        marginBottom: 0,
        marginLeft: 15,
        paddingRight: 8
    },
    like_user: {
        width: 30,
        height: 30,
        overflow: 'hidden',
        borderRadius: '50%',
        marginLeft: 10
    },
    delete: {
        float: 'right',
        height: 32,
        width: 40,
        paddingTop: 3,
        marginRight: 15,
        marginBottom: 0
    },
    avatar: {
        float: 'left',
        width: 30,
        height: 30,
        overflow: 'hidden',
        borderRadius: '50%',
        marginRight: 10
    },
    name: {
        align: 'left',
        textAlign: 'left',
        fontSize: 15,
        lineHeight: '15px'
    },
    time: {
        marginTop: 2,
        textAlign: 'left',
        fontSize: 12,
        lineHeight: '12px',
        color: '#999999'
    },
    d1: {
        display: 'table',
        tableLayout: 'fixed',
        width: '100%',
        height: 64,
        marginTop: 20
    },
    d2: {
        display: 'table-cell',
        textAlign: 'center',
        align: 'center',
        width: '100%',
        verticalAlign: 'middle'
    },
    reads: {
        display: 'inline-block',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 12,
        height: 24,
        fontSize: 12,
        lineHeight: '24px',
        border: '1px solid rgba(0, 0, 0, 0.15)',
    },
    input_d: (record) => ({
        height: 48 + (record ? 132 : 0),
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: '#ffffff',
        WebkitBackfaceVisibility: 'hidden', // Make sure the bar is visible when a modal animates in.
        BackfaceVisibility: 'hidden'
    }),
    input_text: {
        paddingTop: 6,
        paddingLeft: 8,
        backgroundColor: '#f1f1f1',
        borderTop: '1px solid #dfdfdd',
        borderBottom: '1px solid #dfdfdd',
        height: 48
    },
    record_btn: {
        display: 'inline-block',
        width: 52,
        paddingLeft: 7,
        paddingRight: 15
    },
    input: (show_record_btn) => ({
        width: screenSize().width - 70 - (show_record_btn ? 52 : 0),
        height: 32,
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        border: '1px solid #dfdfdd',
    }),
    send: {
        display: 'inline-block',
        marginTop: 3,
        lineHeight: '32px',
        paddingLeft: 15,
        color: '#999999'
    }
}
