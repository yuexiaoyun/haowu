import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import * as actions from '../../actions';
import AudioPlayer from './AudioPlayer';
import classNames from 'classnames';
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import screenSize from '../../utility/screen_size'
import qs from 'querystring'


class PostCard extends React.Component {
    constructor() {
        super();
    }
    gotoDetail = () => {
        var { user } = this.props;
        hashHistory.push('detail/' + user._id);
    }
    picHeight = () => {
        var { post } = this.props;
        var w = (screenSize().width - 6) / 2 - 10;
        var h = Math.floor(w * post.h / post.w + 0.5);
        return h;
    }
    render() {
        var { user, post, audio } = this.props;
        var reads = audio && (audio.others_read_count + (audio.me_read ? 1 : 0)) || 0;
        return (
            <div className="card" ref='card'>
                <div className="picture image-icon_image_loading"
                    style={{
                        height: this.picHeight()
                    }}>
                    <img src={fconf.qiniu.site + post.pic_id + '-c167'}
                        onClick={()=>hashHistory.push('post/' + post._id)}/>
                </div>
                <div className="audio-line">
                    <AudioPlayer
                        post_id={post._id}
                        audio_id={post.audio_id}
                        length={post.length} />
                    { reads > 0 &&<span
                        className={classNames({
                            'image-icon_home_listened': true,
                            'praise': true
                        })}
                        onClick={()=>{hashHistory.push('/read_list/' + post.audio_id)}}>
                        { reads }
                    </span> }
                </div>
                { user && <a className='user-line' onClick={()=>setTimeout(this.gotoDetail, 300)}>
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
