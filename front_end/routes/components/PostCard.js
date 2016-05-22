import React from 'react';
import { Link, hashHistory } from 'react-router';

export default class PostCard extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var data = this.props;
        wx.ready(() => {
            wx.downloadImage({
                serverId: data.post.pic_id,
                isShowProgressTips: 0,
                success: res => {
                    this.setState({pic_id: res.localId});
                },
                fail: res => {
                    alert(JSON.stringify(res));
                }
            });

            /*
            wx.onMenuShareAppMessage({
                title: data.user.nickname + '分享的私物',
                desc: '某产品经理的设计里面既没有标题也没有描述',
                link: 'http://haowu.tunnel.qydev.com/app/post/' + data.post._id
            });
            */
        });
    }
    play_audio = () => {
        var data = this.props;
        wx.downloadVoice({
            serverId: data.post.audio_id,
            success: res => {
                wx.playVoice({
                    localId: res.localId
                });
            },
            fail: res => {
                alert(JSON.stringify(res));
            }
        });
    }
    render() {
        var { user, post } = this.props;
        var { audio, pic_id } = this.state;
        return (
            <div className="card facebook-card">
              <div className="card-header no-border">
                <div className="facebook-avatar">
                  <img src={user.headimgurl} width="34" height="34" />
                </div>
                <div className="facebook-name">{user.nickname}</div>
                <div className="facebook-date">{user.province}</div>
              </div>
              <div className="card-content">
                <div className="livePlayBox">
                  <img src={pic_id} className="bgTranslate"/>
                </div>
              </div>
              <div className="card-footer no-border">
                <span className="link" onClick={this.play_audio}>播放语音</span>
                <span className="link"></span>
                <span className="link">赞</span>
              </div>
            </div>
        );
    }
}
