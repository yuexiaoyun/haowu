import React from 'react';
import { findDOMNode } from 'react-dom';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import { fromObjectId } from '../../utility/format_time';

import AudioPlayer from '../components/AudioPlayer';
import NameSpan from './NameSpan'
import Reply from './Reply'

import { connect } from 'react-redux'
import styles from './Comment.css'
import CSSModules from 'react-css-modules';

class Comment extends React.Component {
    componentDidMount() {
        if (this.props.new_id == this.props.comment._id) {
            console.log('new_id');
            var dom = findDOMNode(this);
            setTimeout(()=>dom.scrollIntoViewIfNeeded(true), 0);
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
            <div styleName={new_id == comment._id ? 'root-new-item' : 'root'}>
                <div styleName="user-line" onClick={this.onClick}>
                    <img styleName='avatar' src={user.headimgurl} onClick={this.avatarClick}/>
                    <div styleName='nickname'>{user.nickname}
                        { post.user_id == comment.user_id && <span styleName='louzhu'>物主</span> }
                    </div>
                    <div styleName='time'>{ fromObjectId(comment._id) }</div>
                </div>
                { comment.status == 1 && <div styleName='comment-text' ref='text'>
                    {comment.audio_id
                        ? <AudioPlayer key={comment.audio_id} audio_id={comment.audio_id} length={comment.d}/>
                        : <span onClick={this.onClick}>{comment.text}</span> }
                </div> }
                { comment.status == 0 && <div styleName='comment-text' ref='text'>
                    该评论已删除
                </div> }
                { comment.replies.length > 0 && <div styleName='replies'>
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

var mapStateToProps = (state, props) => {
    return {
        user: state.users[props.comment.user_id]
    }
}

export default connect(mapStateToProps)(
    CSSModules(Comment, styles)
);
