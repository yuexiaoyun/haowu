import React from 'react';
import qs from 'querystring';
import { parse_online_json } from '../utility/fetch_utils';
import showProgress from '../utility/show_progress';
import screenSize from '../utility/screen_size';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import BottomButton from './components/BottomButton';
import CssButton from './components/CssButton';
import PopupHelper from '../utility/PopupHelper';

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
                    setTimeout(this.refresh, 1);
                }
            } else if (this.state.playing) {
                var f = new Date() - this.state.playing;
                this.setState({f: f});
                setTimeout(this.refresh, 1);
            }
        } catch(err) {
            alert(err);
        }
    }
    stop_audio = () => {
        wx.stopRecord({
            success: res => {
                if (this.state.d <= 4500) {
                    PopupHelper.toast('录音时间小于5秒，请重新录音');
                    this.setState({recording: null, audio_id: null, d: 0});
                }
                else {
                    this.setState({recording: null, audio_id: res.localId});
                }
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
        this.setState({playing: new Date()});
        setTimeout(this.refresh, 10);
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
    // 上传：目前只能上传到微信的服务器上
    pub = () => {
        var { audio_id } = this.state;
        if (audio_id) {
            var pic_id = this.props.local_pic_id;
            showProgress('发布中', new Promise((resolve, reject) => {
                wx.uploadVoice({
                    localId: audio_id,
                    isShowProgressTips: 0,
                    success: res => {
                        var audio_server_id = res.serverId;
                        wx.uploadImage({
                            localId: pic_id,
                            isShowProgressTips: 0,
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
                                        resolve('发布成功');
                                    }).catch(e => {
                                        reject(e);
                                    });
                            },
                            fail: res => {
                                reject(JSON.stringify(res));
                            }
                        });
                    },
                    fail: res => {
                        reject(JSON.stringify(res));
                    }
                });
            }));
        }
    }
    render() {
        var pic_id = this.props.local_pic_id;
        var { recording, audio_id, playing, d } = this.state;
        var duration;
        d = Math.floor(d / 1000 + 0.5);
        var progress = 0;
        if (playing) {
            progress = Math.floor(this.state.f * 100 / this.state.d + 0.5);
        }
        else if (recording)
            progress = Math.floor(this.state.d * 100 / 60000 + 0.5);
        return (
            <div className="content">
                <div className="pub" style={{marginBottom:0}}>
                    <div className="dummy" />
                    <div className="pubBox" style={{marginBottom:0}}>
                        <span className="pubBoxSpan"/>
                        <img src={pic_id} className="bgTranslate"/>
                    </div >
                </div>
                <div style={{backgroundColor:'#ff3333',width:''+ progress + '%',height:3,marginTop:-8}}></div>
                <div style={styles.d()}>
                    <div style={styles.dd}>
                    <div style={{display:'table-cell', width:0, height:'100%'}} />
                        <div style={styles.d0}>
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
                            <div style={{textAlign: 'center'}}>
                                <div className="text-secondary">用声音记录</div>
                                <div className="text-secondary">它的故事 你的生活</div>
                            </div>
                        </div>
                    </div>
                </div>
                <BottomButton txt='发布' disabled={!audio_id} onClick={this.pub}/>
            </div>
        );
    }
}

var styles = {
    d: () => {
        return {
            position: 'absolute',
            top: screenSize().width,
            bottom: 52,
            width: '100%'
        };
    },
    dd: {
        display: 'table',
        width: '100%',
        height: '100%'
    },
    d0: {
        display: 'table-cell',
        verticalAlign: 'middle'
    },
    d1: {
        display: 'table',
        marginBottom: 5,
        tableLayout: 'fixed',
        width: '100%',
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

module.exports = connect(state=>(state))(Pub);
