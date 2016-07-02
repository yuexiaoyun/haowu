import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import * as actions from '../../actions';
import AudioPlayer from './AudioPlayer';
import classNames from 'classnames';
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import qs from 'querystring'


class PostCard extends React.Component {
    constructor() {
        super();
    }
    gotoUserDetail = () => {
        var { user, post } = this.props;
        fetch('/ping/feed?' + qs.stringify({
            post_id: post._id,
            type: 'enter_user_detail'
        }), {credentials: 'same-origin'});
        hashHistory.push('detail/' + user._id);
    }
    gotoDetail = () => {
        var { user, post } = this.props;
        fetch('/ping/feed?' + qs.stringify({
            post_id: post._id,
            type: 'enter_post_detail'
        }), {credentials: 'same-origin'});
        hashHistory.push('post/' + post._id);
    }
    picHeight = () => {
        var { post } = this.props;
        var w = this.props.w - 10;
        var h = Math.floor(w * post.h / post.w + 0.5);
        return h;
    }
    postfix = () => {
        var width = window.innerWidth;
        if (width > window.innerHeight)
            width = window.innerHeight;
        if (width == 320)
            return '-c294';
        else if (width == 375)
            return '-c349';
        else if (width == 414)
            return '-c582';
        else
            return '-c334';
    }
    render() {
        var { user, post, audio } = this.props;
        var read_count = audio && audio.read_count || 0;
        return (
            <div className="card" ref='card'>
                <div className="picture image-image_default_home"
                    style={{
                        height: this.picHeight()
                    }}>
                    <img src={fconf.qiniu.site + post.pic_id + this.postfix()}
                        onClick={this.gotoDetail}/>
                </div>
                <div className="audio-line">
                    <AudioPlayer
                        post_id={post._id}
                        user_id={post.user_id}
                        audio_id={post.audio_id}
                        length={post.length} />
                    { read_count > 0 &&<span
                        className={classNames({
                            'image-icon_home_listened': true,
                            'praise': true
                        })}
                        onClick={()=>{hashHistory.push('/read_list/' + post.audio_id)}}>
                        { read_count }
                    </span> }
                </div>
                { user && <a className='user-line' onClick={()=>setTimeout(this.gotoUserDetail, 300)}>
                    <img className='avatar' src={user.headimgurl} />
                    <span className='nickname'>{user.nickname}</span>
                </a> }
            </div>
        );
    }
}

export default connect((state, props) => {
    var { post } = props;
    var audio = state.audios[post.audio_id];
    return {
        audio
    }
})(PostCard);
