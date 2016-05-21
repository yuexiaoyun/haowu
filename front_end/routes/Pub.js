import React from 'react';

export default class Pub extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    get_pic = () => {
        wx.chooseImage({
            count: 1,
            success: res => {
                this.setState({pic_id: res.localIds[0]});
            }
        });
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
        var { audio_id, pic_id } = this.state;
        wx.uploadVoice({
            localId: audio_id,
            success: res => {
                var audio_server_id = res.serverId;
                wx.uploadImage({
                    localId: pic_id,
                    success: res => {
                        var pic_server_id = res.serverId;
                        alert('上传成功: ' + audio_server_id + ',' + pic_server_id);
                    },
                    fail: res => {}
                });
            },
            fail: res => {}
        });
    }
    render() {
        var { recording, pic_id, audio_id } = this.state;
        return (
            <div className="wxapi_container">
                <div className="lbox_close wxapi_form">
                    { pic_id && <img id="pic_show" src={pic_id} width="100%"/> }
                    <button className="btn btn_primary" onClick={this.get_pic}>{pic_id ? '重新拍照' : '拍照'}</button>
                    <span className="desc">添加一段语音描述</span>
                    { audio_id && <button className="btn btn_primary" onClick={this.play_audio}>播放刚才录制的语音</button>}
                    <button className="btn btn_primary" onClick={this.get_audio}>
                        {recording ? '停止录音' : (audio_id ? '重新录音' : '录音')}
                    </button>
                    { pic_id && audio_id && <button className="btn btn_primary" style={{marginTop: 30}} onClick={this.pub}>发布</button> }
                </div>
            </div>
        );
    }
}
