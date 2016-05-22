import React from 'react';
import qs from 'querystring';
import { parse_online_json } from '../utility/fetch_utils';
import { hashHistory } from 'react-router';

export default class Pub extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    get_audio = () => {
        var { recording } = this.state;
        if (!recording) {
            wx.startRecord({
                cancel: () => {
                    this.setState({recording: false});
                }
            });
            this.setState({recording: true, audio_id: null});
        } else {
            wx.stopRecord({
                success: res => {
                    this.setState({recording: false, audio_id: res.localId});
                },
                fail: res => {
                    alert(JSON.stringify(res));
                }
            });
        }
    }
    play_audio = () => {
        var { audio_id } = this.state;
        wx.playVoice({
            localId: audio_id
        });
    }
    // 上传：目前只能上传到微信的服务器上
    pub = () => {
        var { audio_id } = this.state;
        var pic_id = 'weixin://resourceid/' + this.props.params.id;
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
        var pic_id = 'weixin://resourceid/' + this.props.params.id;
        var { recording, audio_id } = this.state;
        return (
                <div className="container-fluid">
                <div className="livePlayBox">
                  <img src={pic_id} className="bgTranslate"/>
                </div>
                { audio_id && <button className="btn btn-primary btn-block" onClick={this.play_audio}>播放刚才录制的语音</button>}
                <button className="btn btn-primary btn-block" onClick={this.get_audio}>
                    {recording ? '停止录音' : (audio_id ? '重新录音' : '录音')}
                </button>
                { audio_id && <button className="btn btn_primary" style={{marginTop: 30}} onClick={this.pub}>发布</button> }
            </div>
        );
    }
}
