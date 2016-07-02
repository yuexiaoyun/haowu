import React from 'react';
import { findDOMNode } from 'react-dom';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';

import AudioPlayer from '../components/AudioPlayer';
import NameSpan from './NameSpan'

import { connect } from 'react-redux'
import { fromObjectId } from '../../utility/format_time';
// TODO: 对评论和回复内容的Server端验证
// TODO: 相对时间的重刷
// TODO: 微信昵称重名问题


class _Reply extends React.Component {
    componentDidMount() {
        if (this.props.new_id == this.props.reply._id) {
            var dom = findDOMNode(this);
            dom.scrollIntoViewIfNeeded(true);
        }
    }
    onClick = (e) => {
        e.stopPropagation();
        var { reply, onClick } = this.props;
        if (reply.user_id != window.user_id) {
            var dom = findDOMNode(this);
            onClick(dom);
        }
    }
    render() {
        var { reply, user, user2 } = this.props;
        return (
            <div className="reply-text" onClick={this.onClick}>
                <NameSpan user={user} />{' 回复 '}<NameSpan user={user2} />：
                {reply.audio_id ?
                    <AudioPlayer key={reply.audio_id} audio_id={reply.audio_id} length={reply.d}/>
                    : reply.text}
            </div>
        );
    }
}

var Reply = connect((state, props) => {
    return {
        user: state.users[props.reply.user_id],
        user2: state.users[props.reply.user_id2]
    }
})(_Reply);

class Comment extends React.Component {
    componentDidMount() {
        if (this.props.new_id == this.props.comment._id) {
            var dom = findDOMNode(this);
            dom.scrollIntoViewIfNeeded(true);
        }
    }
    onClick = (e) => {
        e.stopPropagation();
        var { comment, reply } = this.props;
        if (comment.user_id != window.user_id) {
            reply(comment._id, comment.user_id, this.refs.text);
        }
    }
    avatarClick = (e) => {
        e.stopPropagation();
        hashHistory.push('/detail/' + this.props.user._id);
    }
    render() {
        var { post, comment, user, reply, onClick, new_id } = this.props;
        return (
            <div className='comment'>
                <div className="user-line" onClick={this.onClick}>
                    <img className='avatar' src={user.headimgurl}  onClick={this.avatarClick}/>
                    <div className='nickname'>{user.nickname}
                        { post.user_id == comment.user_id && <span className='louzhu'>物主</span> }
                    </div>
                    <div className='text-secondary'>{ fromObjectId(comment._id) }</div>
                </div>
                { comment.status == 1 && <div className='comment-text' ref='text'>
                    {comment.audio_id
                        ? <AudioPlayer key={comment.audio_id} audio_id={comment.audio_id} length={comment.d}/>
                        : <span onClick={this.onClick}>{comment.text}</span> }
                </div> }
                { comment.status == 0 && <div className='comment-text comment-text-deleted' ref='text'>
                    该评论已删除
                </div> }
                { comment.replies.length > 0 && <div className='replies'>
                    { comment.replies.map((reply)=>(
                        <Reply
                            key={reply._id}
                            reply={reply}
                            new_id={new_id}
                            onClick={(dom)=>{
                                if (reply.user_id != window.user_id)
                                    this.props.reply(comment._id, reply.user_id, dom);
                            }} />
                    )) }
                </div> }
            </div>
        );
    }
};

export default connect((state, props) => {
    return {
        user: state.users[props.comment.user_id]
    }
})(Comment);
