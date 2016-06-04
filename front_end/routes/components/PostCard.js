import React from 'react';
import { Link, hashHistory } from 'react-router';
import fconf from '../../fconf';
import CssButton from './CssButton'
import Sound from 'react-sound'
import LazyLoad from 'react-lazyload'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { soundManager } from 'soundmanager2'
import screenSize from '../../utility/screen_size'
import qs from 'querystring'

class PostCard extends React.Component {
    constructor() {
        super();
        this.state = {i: 3};
    }
    play_audio = () => {
        var playing = this.props.sound_id == this.props.post._id;
        if (playing) {
            this.stop_play();
        } else {
            this.props.dispatch(createAction('play_sound')(this.props.post._id));
            var url = '/api/read?' + qs.stringify({
                _id: this.props.post._id
            });
            fetch(url, {credentials: 'same-origin'});
            this.timer = setInterval(this.refresh, 10);
        }
    }
    refresh = () => {
        var playing = this.props.sound_id == this.props.post._id;
        var d = playing ? (new Date() - this.props.sound_playing) : 250;
        var i = Math.floor(d / 300) % 3 + 1;
        this.setState({i : i});
        if (!playing)
            clearInterval(this.timer);
    }
    stop_play = () => {
        this.props.dispatch(createAction('stop_play')(this.props.post._id));
    }
    preview = () => {
        var { post } = this.props;
        wx.previewImage({
            current: fconf.qiniu.site + post.pic_id,
            urls: [fconf.qiniu.site + post.pic_id]
        });
    }
    gotoDetail = () => {
        var { user } = this.props;
        hashHistory.push('detail/' + user.openid);
    }
    picHeight = () => {
        var { post } = this.props;
        var w = (screenSize().width - 6) / 2 - 10;
        var h = Math.floor(w * post.h / post.w + 0.5);
        return h;
    }
    like = () => {
        var { post, dispatch } = this.props;
        dispatch(createAction('like')(post._id));
        var url = '/api/like?' + qs.stringify({
            _id: post._id
        });
        fetch(url, {credentials: 'same-origin'});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.sound_id != nextProps.sound_id
            || this.state.i != nextState.i
            || this.props.likes[this.props.post._id] != nextProps.likes[this.props.post._id]
            || this.props.reads[this.props.post._id] != nextProps.reads[this.props.post._id];
    }
    render() {
        var { user, post, likes, reads } = this.props;
        var { i } = this.state;
        var length = Math.floor(post.length / 1000 + 0.5);
        var playing = this.props.sound_id == post._id;
        var me_like = this.props.likes[this.props.post._id];
        var me_read = this.props.reads[this.props.post._id];
        return (
            <div className="card facebook-card" ref='card'>
                <div className="card-content image-icon_image_loading"
                    style={{
                        height: this.picHeight(),
                        backgroundColor: '#f8f8f8',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '24px 24px'
                    }}>
                    <img src={fconf.qiniu.site + post.pic_id + '-c167'}
                        style={{width:'100%', overflow:'hidden',borderRadius:5}}
                        onClick={this.preview}/>
                </div>
                <div style={styles.d1}>
                    <span style={styles.audio(me_read)} onClick={this.play_audio}>
                        <CssButton
                            className={"image-btn_home_play"+ (playing ? i : 3)}
                            width={16}
                            height={16}/>
                        <span style={styles.audio_length}>{`${length}"`}</span>
                    </span>
                    <span style={styles.praise}>
                        <CssButton
                            className={me_like == 1 ? "image-btn_praise_selected" : "image-btn_praise_default"}
                            style={{float:'right'}}
                            onClick={this.like}
                            width={20}
                            height={20}/>
                    </span>
                </div>
                { user && <div style={styles.d2} onClick={this.gotoDetail}>
                    <img src={user.headimgurl} width="34" height="34" style={styles.avatar}/>
                    <span style={styles.name}><strong>{user.nickname}</strong></span>
                </div> }
                { playing && <Sound
                    url={fconf.qiniu.site + post.audio_id + '_mp3'}
                    playStatus={Sound.status.PLAYING}
                    onFinishedPlaying={this.stop_play}
                    /> }
            </div>
        );
    }
}

module.exports = connect((state)=>({
    sound_id: state.sound_id,
    sound_playing: state.sound_playing,
    likes: state.likes,
    reads: state.reads
}))(PostCard);

var styles = {
    d1: {
        display: 'table',
        paddingLeft: 6,
        paddingTop: 10,
        paddingBottom: 8,
        width: '100%'
    },
    d2: {
        width: '100%',
        paddingLeft: 12,
        paddingTop: 8,
        paddingBottom: 12,
    },
    audio: (read) => ({
        display: 'table-cell',
        verticalAlign: 'middle',
        borderRadius: 12,
        height: 24,
        paddingLeft: 6,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#ff3333'
    }),
    audio_length: {
        marginLeft: 15,
        color: '#ffffff',
        marginRight: 10
    },
    praise: {
        display: 'table-cell',
        width: '100%',
        verticalAlign: 'middle',
        align: 'right',
        textAlign: 'right',
        paddingRight: 10
    },
    avatar: {
        float: 'left',
        width: 34,
        height: 34,
        overflow: 'hidden',
        borderRadius: '50%'
    },
    name: {
        align: 'left',
        textAlign: 'left',
        lineHeight: '34px',
        paddingLeft: 5,
        verticalAlign: 'middle',
        fontSize: 12
    }
}
