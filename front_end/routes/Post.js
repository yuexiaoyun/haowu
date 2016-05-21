import React from 'react';
import qs from 'querystring';
import { parse_online_json } from '../utility/fetch_utils';

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
                wx.downloadImage({
                    serverId: data.post.pic_id,
                    success: res => {
                        this.setState({pic_id: res.localId});
                    },
                    fail: res => {
                        alert(JSON.stringify(res));
                    }
                });
            });
    }
    play_audio = () => {
        var { audio_id } = this.state;
        wx.playVoice({
            localId: audio_id
        });
    }
    render() {
        var { pic_id, audio_id } = this.state;
        return (
            <div className="wxapi_container">
                <div className="lbox_close wxapi_form">
                    { pic_id && <img id="pic_show" src={pic_id} width="100%"/> }
                    <span className="desc">播放语音</span>
                    <button className="btn btn_primary" onClick={this.play_audio}>播放</button>
                </div>
            </div>
        );
    }
}
