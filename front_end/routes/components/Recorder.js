import React from 'react';
import CssButton from './CssButton';
import PopupHelper from '../../utility/PopupHelper';

export default class Recorder extends React.Component {
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
            cancel: () => {
                this.setState({recording: null});
            }
        });
        this.setState({recording: new Date(), audio_id: null, d: 0});
        this.props.onData({audio_id: null, d: 0});
    }
    clear = () => {
        if (this.state.audio_id && !this.state.playing) {
            this.setState({recording: false, audio_id: null, d: 0});
            this.props.onData({audio_id: null, d: 0});
        }
    }
    refresh = () => {
        var progress = 0;
        try {
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
        } catch(err) {
            alert(err);
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
                alert(JSON.stringify(res));
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
        return (
            <div>
                <div style={{backgroundColor:'#ff6b6b',width:''+ progress + '%',height:3}}></div>
                <div style={styles.d1}>
                    <div style={styles.d2}>
                        { d > 0 && d + '"' }
                    </div>
                    <div style={styles.d2}>
                        { !audio_id && !recording && <CssButton
                            className='image-btn_tape_start'
                            onClick={this.get_audio}
                            width={60}
                            height={60}/> }
                        { recording && <CssButton
                            className='image-btn_tape_stop'
                            onClick={this.stop_audio}
                            width={60}
                            height={60}/> }
                        { playing && <CssButton
                            className='image-btn_play_stop'
                            onClick={this.stop_play}
                            width={60}
                            height={60}/> }
                        { audio_id && !playing && <CssButton
                            className='image-btn_play_start'
                            onClick={this.play_audio}
                            width={60}
                            height={60}/> }
                    </div>
                    <div style={styles.d2}>
                        <CssButton
                            className='image-btn_play_again'
                            disabled={!audio_id || !!playing}
                            onClick={this.clear}
                            width={44}
                            height={44}/>
                    </div>
                </div>
            </div>
        );
    }
}

var styles = {
    d1: {
        display: 'table',
        tableLayout: 'fixed',
        width: '100%',
        marginTop: 33,
        height: 64
    },
    d2: {
        display: 'table-cell',
        textAlign: 'center',
        align: 'center',
        width: '100%',
        verticalAlign: 'middle'
    }
}
