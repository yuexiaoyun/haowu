import React from 'react';
import { Link, hashHistory } from 'react-router';
import fconf from '../../fconf';
import CssButton from './CssButton'

export default class PostCard extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var data = this.props;
    }
    play_audio = () => {
        try {
            this.refs.audio.play();
        } catch(err) {
            alert(err);
        }
    }
    preview = () => {
        var { post } = this.props;
        wx.previewImage({
            current: fconf.qiniu.site + post.pic_id,
            urls: [fconf.qiniu.site + post.pic_id]
        });
    }
    render() {
        var { user, post } = this.props;
        var { audio } = this.state;
        var length = Math.floor(post.length / 1000 + 0.5);
        return (
            <div className="card facebook-card">
                <div className="card-content">
                    <img src={fconf.qiniu.site + post.pic_id}
                        style={{overflow:'hidden',borderRadius:5}}
                        className="bgTranslate"
                        onClick={this.preview}/>
                </div>
                <div style={styles.d1}>
                    <span style={styles.audio}>
                        <CssButton className="image-btn_home_play3" width={16} height={16}/>
                        <span style={styles.audio_length}>{`${length}"`}</span>
                    </span>
                    <span style={styles.praise}>
                        <CssButton className="image-btn_praise_default" style={{float:'right'}} width={20} height={20}/>
                    </span>
                </div>
                <div style={styles.d2}>
                    <img src={user.headimgurl} width="34" height="34" style={styles.avatar}/>
                    <span style={styles.name}>{user.nickname}</span>
                </div>
                <audio ref="audio"><source src={fconf.qiniu.site + post.audio_id} /></audio>
            </div>
        );
    }
}

var styles = {
    d1: {
        display: 'table',
        paddingLeft: 6,
        paddingTop: 10,
        paddingBottom: 8,
        width: '100%'
    },
    d2: {
        display: 'table',
        paddingLeft: 12,
        paddingTop: 8,
        paddingBottom: 12,
    },
    audio: {
        display: 'table-cell',
        verticalAlign: 'middle',
        borderRadius: 12,
        height: 24,
        paddingLeft: 6,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#ff3333',
    },
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
        display: 'table-cell',
        width: 34,
        height: 34,
        overflow: 'hidden',
        borderRadius: '50%'
    },
    name: {
        display: 'table-cell',
        lineHeight: '34px',
        paddingLeft: 5,
        verticalAlign: 'middle',
        fontSize: 12
    }
}
