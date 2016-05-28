import React from 'react';
import qs from 'querystring';
import { parse_online_json } from '../utility/fetch_utils';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import BottomButton from './components/BottomButton';

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
        this.updateProgress(0);
        setTimeout(this.refresh, 200);
    }
    clear = () => {
        if (this.state.audio_id && !this.state.playing) {
            this.setState({recording: false, audio_id: null, d: 0});
        }
    }
    refresh = () => {
        try {
            if (this.state.recording) {
                var d = new Date() - this.state.recording;
                this.setState({d: d});
                if (d > 59500)
                    this.stop_audio();
                else {
                    var progress = d * 100 / 60000;
                    this.updateProgress(progress);
                    setTimeout(this.refresh, 200);
                }
            } else if (this.state.playing) {
                var f = new Date() - this.state.playing;
                var progress = f * 100 / this.state.d;
                this.updateProgress(progress);
                setTimeout(this.refresh, 10);
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
                    this.setState({recording: null, audio_id: null, d: 0});
                    this.updateProgress(0);
                }
                else {
                    this.setState({recording: null, audio_id: res.localId});
                    this.updateProgress(0);
                }
            },
            fail: res => {
                alert(JSON.stringify(res));
            }
        });
        this.updateProgress(0);
    }
    play_audio = () => {
        var { audio_id } = this.state;
        wx.playVoice({
            localId: audio_id
        });
        this.setState({playing: new Date()});
        this.updateProgress(0);
        setTimeout(this.refresh, 10);
        wx.onVoicePlayEnd({
            success: res => {
                this.setState({playing: null});
                this.updateProgress(0);
            }
        });
    }
    stop_play = () => {
        var { audio_id } = this.state;
        wx.stopVoice({
            localId: audio_id
        });
        this.setState({playing: null});
        this.updateProgress(0);
    }
    // 上传：目前只能上传到微信的服务器上
    pub = () => {
        var { audio_id } = this.state;
        if (audio_id) {
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
                                audio_id: audio_server_id,
                                length: this.state.d
                            });
                            fetch(url, {credentials: 'same-origin'})
                                .then(parse_online_json)
                                .then(data => {
                                    hashHistory.replace('/home');
                                });
                        },
                        fail: res => {
                            alert(JSON.stringify(res));
                        }
                    });
                },
                fail: res => {
                    alert(JSON.stringify(res));
                }
            });
        }
    }
    canvasClick = () => {
        var { recording, playing, audio_id } = this.state;
        if (recording) {
            this.stop_audio();
        } else if (audio_id) {
            playing ? this.stop_play() : this.play_audio();
        } else {
            this.get_audio();
        }
    }
    updateProgress = (progress) => {
        var canvas = this.refs.progress;
        try {
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, 64, 64);

            context.beginPath();
            context.moveTo(32, 32);
            context.arc(32, 32, 32, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = '#ff9999';
            context.fill();

            context.beginPath();
            context.moveTo(32, 32);
            context.arc(32, 32, 32, 1.5*Math.PI, 1.5*Math.PI + Math.PI * 2 * progress / 100, false);
            context.closePath();
            context.fillStyle = '#ff3333';
            context.fill();

            context.beginPath();
            context.moveTo(32, 32);
            context.arc(32, 32, 28, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = '#ff3333';
            context.fill();
        } catch(err) {
            alert(err);
        }
    }
    componentDidMount() {
        this.updateProgress(0);
    }
    render() {
        var pic_id = this.props.local_pic_id;
        var { recording, audio_id, playing, d } = this.state;
        var duration;
        d = Math.floor(d / 1000 + 0.5);
        return (
                <div className="content">
                    <div className="pub">
                        <div className="dummy" />
                        <div className="pubBox">
                            <span className="pubBoxSpan"/>
                            <img src={pic_id} className="bgTranslate"/>
                        </div>
                    </div>
                    <div style={styles.d1}>
                        <div style={{...styles.d2, color:'#ff3333'}}>
                            { d > 0 && d + '"' }
                        </div>
                        <div style={styles.d2}>
                            <canvas ref='progress' width="64px" height="64px" onClick={this.canvasClick}></canvas>
                        </div>
                        <div style={styles.d2}>
                            <button
                                className={"button button-dark button-round" + (!audio_id ? ' disabled' : '')}
                                onClick={this.clear}
                                >
                            重录
                            </button>
                        </div>
                    </div>
                    { !audio_id && !recording && <div style={{textAlign: 'center'}}>
                        <div className="text-secondary">来段有温度的声音吧！</div>
                        <div className="text-secondary">最多可录制60秒</div>
                    </div> }
                    { recording && <div style={{textAlign: 'center'}}>
                        <div className="text-secondary">点击停止录音</div>
                    </div> }
                    { playing && <div style={{textAlign: 'center'}}>
                        <div className="text-secondary">点击停止播放</div>
                    </div> }
                    { audio_id && !playing && <div style={{textAlign: 'center'}}>
                        <div className="text-secondary">点击播放</div>
                    </div> }
                    <BottomButton txt='发布' disabled={!audio_id} onClick={this.pub}/>
                </div>
        );
    }
}

var styles = {
    d1: {
        display: 'table',
        marginTop: 15,
        tableLayout: 'fixed',
        width: '100%'
    },
    d2: {
        display: 'table-cell',
        textAlign: 'center',
        align: 'center',
        width: '100%',
        verticalAlign: 'middle'
    }
}

module.exports = connect(state=>(state))(Pub);
