import React from 'react';
import qs from 'querystring';
import { parse_online_json } from '../utility/fetch_utils';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';

class Pub extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    get_audio = () => {
        wx.startRecord({
            cancel: () => {
                this.setState({recording: null});
            }
        });
        this.setState({recording: new Date(), audio_id: null, d: 0});
        setTimeout(this.refresh, 200);
    }
    refresh = () => {
        try {
            if (this.state.recording) {
                var d = new Date() - this.state.recording;
                this.setState({d: d});
                if (d > 59500)
                    this.stop_audio();
                else
                    setTimeout(this.refresh, 200);
            }
        } catch(err) {
            alert(err);
        }
    }
    stop_audio = () => {
        wx.stopRecord({
            success: res => {
                if (this.state.d <= 4500) {
                    alert('录音时间小于5秒，请重新录音');
                    this.setState({recording: null, audio_id: null});
                }
                else
                    this.setState({recording: null, audio_id: res.localId});
            },
            fail: res => {
                alert(JSON.stringify(res));
            }
        });
    }
    play_audio = () => {
        var { audio_id } = this.state;
        wx.playVoice({
            localId: audio_id
        });
        this.setState({playing: true});
        wx.onVoicePlayEnd({
            success: res => {
                this.setState({playing: false});
            }
        });
    }
    stop_play = () => {
        var { audio_id } = this.state;
        wx.stopVoice({
            localId: audio_id
        });
        this.setState({playing: false});
    }
    // 上传：目前只能上传到微信的服务器上
    pub = () => {
        var { audio_id } = this.state;
        var pic_id = this.props.local_pic_id;
        wx.uploadVoice({
            localId: audio_id,
            success: res => {
                var audio_server_id = res.serverId;
                wx.uploadImage({
                    localId: pic_id,
                    success: res => {
                        var pic_server_id = res.serverId;
                        var url = '/api/pub_post?' + qs.stringify({
                            pic_id: pic_server_id,
                            audio_id: audio_server_id
                        });
                        fetch(url, {credentials: 'same-origin'})
                            .then(parse_online_json)
                            .then(data => {
                                hashHistory.replace('/home');
                            });
                    },
                    fail: res => {}
                });
            },
            fail: res => {}
        });
    }
    render() {
        var pic_id = this.props.local_pic_id;
        var { recording, audio_id, playing, d } = this.state;
        var duration;
        d = Math.floor(d / 1000 + 0.5);
        return (
                <div className="content">
                    <div className="content-block">
                        <div className="livePlayBox">
                            <img src={pic_id} className="bgTranslate"/>
                        </div>
                        { audio_id && !playing && <p><a className="button button-fill button-big" onClick={this.play_audio}>
                            播放({ d }秒)
                        </a></p> }
                        { audio_id && playing && <p><a className="button button-fill button-big" onClick={this.stop_play}>
                            播放中...
                        </a></p> }
                        { !recording && <p><a className="button button-fill button-big" onClick={this.get_audio}>
                            {audio_id ? '重录' : '添加语音'}
                        </a></p> }
                        { recording && <p><a className="button button-fill button-big" onClick={this.stop_audio}>
                            正在录音{ d && '(' + d  + '秒)' || null }...点击停止</a></p>
                        }
                        <p><a
                            className={"button button-success button-fill button-big" + (audio_id ? '' : ' disabled')}
                            style={{marginTop: 30}}
                            onClick={this.pub}>
                            发布
                        </a></p>
                    </div>
                </div>
        );
    }
}

module.exports = connect(state=>(state))(Pub);
