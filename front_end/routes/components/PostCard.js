import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import * as actions from '../../actions';
import AudioPlayer from './AudioPlayer';
import CssButton from './CssButton'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { soundManager } from 'soundmanager2'
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
                        onClick={()=>hashHistory.push('post/' + post._id)}/>
                </div>
                <div style={styles.d1}>
                    <AudioPlayer audio_id={post.audio_id} length={post.length}/>
                    <span style={styles.praise}>
                        <CssButton
                            className={post.me_like ? "image-btn_praise_selected" : "image-btn_praise_default"}
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
            </div>
        );
    }
}

module.exports = connect((state)=>({
    sound_id: state.sound_id,
    sound_playing: state.sound_playing
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
