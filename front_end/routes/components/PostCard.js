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
    gotoDetail = () => {
        var { user } = this.props;
        hashHistory.push('detail/' + user._id);
    }
    picHeight = () => {
        var { post } = this.props;
        var w = this.props.w - 10;
        var h = Math.floor(w * post.h / post.w + 0.5);
        return h;
    }
    render() {
        var { user, post, audio } = this.props;
        var read_count = audio && audio.read_count || 0;
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
                { user && <a className='user-line' onClick={()=>setTimeout(this.gotoDetail, 300)}>
                    <img className='avatar' src={user.headimgurl} />
                    <span className='nickname'>{user.nickname}</span>
                    { (user.sex == 1 || user.sex == 2) && <span className={classNames({
                        gender: true,
                        'image-icon_male': user.sex == 1,
                        'image-icon_female': user.sex == 2
                    })} />}
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
