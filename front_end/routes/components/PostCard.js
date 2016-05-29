import React from 'react';
import { Link, hashHistory } from 'react-router';
import fconf from '../../fconf';

export default class PostCard extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var data = this.props;
    }
    play_audio = () => {
        try {
            this.refs.audio.play();
        } catch(err) {
            alert(err);
        }
    }
    preview = () => {
        var { post } = this.props;
        wx.previewImage({
            current: fconf.qiniu.site + post.pic_id,
            urls: [fconf.qiniu.site + post.pic_id]
        });
    }
    render() {
        var { user, post } = this.props;
        var { audio } = this.state;
        return (
            <div className="card facebook-card">
              <div className="card-content">
                  <img src={fconf.qiniu.site + post.pic_id} className="bgTranslate" onClick={this.preview}/>
              </div>
              <div className="card-footer no-border">
                <span className="link" onClick={this.play_audio}>播放语音</span>
                <span className="link"></span>
                <span className="link">赞</span>
              </div>
              <audio ref="audio"><source src={fconf.qiniu.site + post.audio_id} /></audio>
            </div>
        );
    }
}
