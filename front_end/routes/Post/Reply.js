import React from 'react';
import { findDOMNode } from 'react-dom';
import fconf from '../../fconf';

import AudioPlayer from '../components/AudioPlayer';
import NameSpan from './NameSpan'

import { connect } from 'react-redux'
import styles from './Reply.css'
import CSSModules from 'react-css-modules';

class Reply extends React.Component {
    componentDidMount() {
        if (this.props.new_id == this.props.reply._id) {
            var dom = findDOMNode(this);
            setTimeout(()=>dom.scrollIntoViewIfNeeded(true), 0);
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
        var { reply, user, user2, new_id } = this.props;
        return (
            <div styleName={new_id==reply._id ? "root-new-item" : 'root'} onClick={this.onClick}>
                <NameSpan user={user} />{' 回复 '}<NameSpan user={user2} />：
                {reply.audio_id ?
                    <AudioPlayer key={reply.audio_id} audio_id={reply.audio_id} length={reply.d}/>
                    : reply.text}
            </div>
        );
    }
}

var mapStateToProps = (state, props) => {
    return {
        user: state.users[props.reply.user_id],
        user2: state.users[props.reply.user_id2]
    }
};

export default connect(mapStateToProps)(
    CSSModules(Reply, styles)
);
