import React from 'react';
import qs from 'querystring';
import { parse_online_json } from '../utility/fetch_utils';
import { hashHistory } from 'react-router';

export default class Pub extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var url = '/api/fetch_post?_id=' + id;
        fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(data => {
                this.setState({user: data.user});
                wx.ready(() => {
                    wx.downloadImage({
                        serverId: data.post.pic_id,
                        success: res => {
                            this.setState({pic_id: res.localId});
                        },
                        fail: res => {
                            alert(JSON.stringify(res));
                        }
                    });
                    wx.downloadVoice({
                        serverId: data.post.audio_id,
                        success: res => {
                            this.setState({audio_id: res.localId});
                        },
                        fail: res => {
                            alert(JSON.stringify(res));
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: data.user.nickname + '分享的私物',
                        desc: '某产品经理的设计里面既没有标题也没有描述',
                        link: 'http://haowu.tunnel.qydev.com/app/post/' + data.post._id
                    });
                });
            }).catch(alert);
    }
    play_audio = () => {
        var { audio_id } = this.state;
        wx.playVoice({
            localId: audio_id
        });
    }
    render() {
        var { pic_id, audio_id, user } = this.state;
        return (
            <div className="wxapi_container">
                <div className="lbox_close wxapi_form">
                    { !pic_id && <span className="desc">图片加载中...</span> }
                    { pic_id && <span className="desc">{ user.nickname }分享的私物</span> }
                    { pic_id && <img id="pic_show" src={pic_id} width="100%"/> }
                    { !audio_id && <span className="desc">语音加载中...</span> }
                    { audio_id && <button className="btn btn_primary" onClick={this.play_audio}>播放语音</button> }
                    <button className="btn btn_primary" style={{marginTop: 30}}onClick={()=>{hashHistory.push('pub')}}>我也来分享自己的私物</button>
                </div>
            </div>
        );
    }
}
