import React from 'react';
import PopupHelper from '../../utility/PopupHelper';
import wx from 'weixin-js-sdk';

import styles from './Recorder.css'
import CSSModules from 'react-css-modules';

class Recorder extends React.Component {
    constructor() {
        super();
        this.state = {progress: 0};
    }
    componentDidMount() {
        this.timer = setInterval(this.refresh, 10);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    get_audio = () => {
        wx.startRecord({
            success: () => {
                this.setState({recording: new Date(), audio_id: null, d: 0});
                this.props.onData({audio_id: null, d: 0});
            },
            cancel: () => {
                this.setState({recording: null});
            }
        });
    }
    clear = () => {
        if (this.state.audio_id && !this.state.playing) {
            this.setState({recording: false, audio_id: null, d: 0});
            this.props.onData({audio_id: null, d: 0});
        }
    }
    refresh = () => {
        var progress = 0;
        if (this.state.recording) {
            var d = new Date() - this.state.recording;
            this.setState({d: d});
            if (d > 59500)
                this.stop_audio();
            else
                progress = (d * 100 / 60000).toFixed(2);
        } else if (this.state.playing) {
            var f = new Date() - this.state.playing;
            progress = (f * 100 / this.state.d).toFixed(2);
        }
        this.setState({progress: progress});
    }
    stop_audio = () => {
        wx.stopRecord({
            success: res => {
                if (this.state.d <= 4500) {
                    PopupHelper.toast('录音时间小于5秒，请重新录音');
                    this.setState({recording: null, audio_id: null, d: 0});
                    this.props.onData({audio_id: null, d: 0});
                }
                else {
                    this.setState({recording: null, audio_id: res.localId});
                    this.props.onData({audio_id: res.localId, d: this.state.d});
                }
            },
            fail: res => {
            }
        });
        this.setState({recording: null});
    }
    play_audio = () => {
        var { audio_id } = this.state;
        wx.playVoice({
            localId: audio_id
        });
        this.setState({playing: new Date()});
        wx.onVoicePlayEnd({
            success: res => {
                this.setState({playing: null, f: 0});
            }
        });
    }
    stop_play = () => {
        var { audio_id } = this.state;
        wx.stopVoice({
            localId: audio_id
        });
        this.setState({playing: null, f: 0});
    }
    upload_voice = () => {
        var { audio_id } = this.state;
        return new Promise((resolve, reject) => {
            wx.uploadVoice({
                localId: audio_id,
                isShowProgressTips: 0,
                success: res => resolve(res.serverId),
                fail: reject
            })
        });
    }
    render() {
        var { recording, audio_id, playing, d, progress } = this.state;
        d = Math.floor(d / 1000 + 0.5);
        if (recording) {
            var onClick = this.stop_audio;
            var className = 'image-btn_tape_stop';
            var hint = '点击结束录音';
        } else if (playing) {
            var onClick = this.stop_play;
            var className = 'image-btn_play_stop';
            var hint = '点击停止播放';
        } else if (audio_id) {
            var onClick = this.play_audio;
            var className = 'image-btn_play_start';
            var hint = '点击开始播放';
        } else {
            var onClick = this.get_audio;
            var className = 'image-btn_tape_start';
            var hint = '点击开始录音';
        }
        return (
            <div styleName='root'>
                <div styleName='progress' style={{width:''+ progress + '%'}}></div>
                <div styleName='record-line'>
                    <div styleName='length'>
                        { d > 0 && d + '"' }
                    </div>
                    <div styleName='recorder-btn' className={className} onClick={onClick} />
                    <div styleName='delete-btn' className={'image-btn_play_again' + ((!audio_id || !!playing) ? '_disabled' : '')}
                        onClick={this.clear}
                        disabled={!audio_id || !!playing}/>
                </div>
                <div styleName='hint'>{hint}</div>
            </div>
        );
    }
}

export default CSSModules(Recorder, styles);
