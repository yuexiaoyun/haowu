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
                    this.setState({recording: null, audio_id: null});
                }
                else
                    this.setState({recording: null, audio_id: res.localId});
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
                    fail: res => {}
                });
            },
            fail: res => {}
        });
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
            context.fillStyle = '#ddd';
            context.fill();

            context.beginPath();
            context.moveTo(32, 32);
            context.arc(32, 32, 32, 0, Math.PI * 2 * progress / 100, false);
            context.closePath();
            context.fillStyle = '#e74c3c';
            context.fill();

            context.beginPath();
            context.moveTo(32, 32);
            context.arc(32, 32, 28, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = 'rgba(255,255,255,1)';
            context.fill();

            context.beginPath();
            context.arc(32, 32, 25, 0, Math.PI * 2, true);
            context.closePath();
                // 与画实心圆的区别,fill是填充,stroke是画线
            context.strokeStyle = '#ddd';
            context.stroke();
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
                    <div style={{textAlign: 'center', marginTop: 30}}>
                        <canvas ref='progress' width="64px" height="64px" onClick={this.canvasClick}></canvas>
                    </div>
                    <BottomButton txt='发布' disabled={!audio_id} onClick={this.pub}/>
                </div>
        );
    }
}

module.exports = connect(state=>(state))(Pub);
