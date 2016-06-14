import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import * as actions from '../../actions';
import AudioPlayer from './AudioPlayer';
import CssButton from './CssButton'
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
    like = () => {
        var { post, dispatch } = this.props;
        dispatch(actions.like(post._id));
    }
    render() {
        var { user, post } = this.props;
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
                    <AudioPlayer audio_id={post.audio_id} length={post.length}/>
                    <span
                        className={`praise ${post.me_like ? "image-btn_praise_selected" : "image-btn_praise_default"}`}
                        onClick={this.like}/>
                </div>
                { user && <div className='user-line' onClick={this.gotoDetail}>
                    <img className='avatar' src={user.headimgurl} />
                    <span className='nickname'>{user.nickname}</span>
                </div> }
            </div>
        );
    }
}

module.exports = connect((state)=>({
    sound_id: state.sound_id,
    sound_playing: state.sound_playing
}))(PostCard);
