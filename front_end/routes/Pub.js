import React from 'react';
import qs from 'querystring';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import showProgress from '../utility/show_progress';
import screenSize from '../utility/screen_size';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import Recorder from './components/Recorder';
import BottomButton from './components/BottomButton';
import PopupHelper from '../utility/PopupHelper';
import setShareInfo from '../utility/set_share_info'

class Pub extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    upload_image = () => {
        var { local_pic_id } = this.props;
        return new Promise((resolve, reject) => {
            wx.uploadImage({
                localId: local_pic_id,
                isShowProgressTips: 0,
                success: res => resolve(res.serverId),
                fail: reject
            });
        });
    }
    pub = () => {
        var { audio_id } = this.state;
        if (audio_id) {
            showProgress('发布中', Promise.all([
                this.refs.recorder.upload_voice(),
                this.upload_image()
            ]).then(data => {
                var url = '/api/pub_post?' + qs.stringify({
                    audio_id: data[0],
                    pic_id: data[1],
                    length: this.state.d
                });
                return update(url);
            }).then(()=> {
                hashHistory.go(-1);
                return '发布成功';
            }).catch(err => {
                alert(err);
                return '发布失败';
            }));
        }
    }
    componentDidMount() {
        window.setTitle('发布好物');
        setShareInfo();
    }
    // TODO: 发布流程的界面还需要再调一下
    render() {
        var pic_id = this.props.local_pic_id;
        return (
            <div>
                <div style={styles.image_d()}>
                    <span style={styles.dummy} />
                    <img src={pic_id} style={styles.image}/>
                </div>
                <Recorder ref='recorder' onData={data=>this.setState(data)}/>
                <BottomButton txt='发布' disabled={!this.state.audio_id} onClick={this.pub}/>
            </div>
        );
    }
}

var styles = {
    image_d: () => ({
        width: '100%',
        height: screenSize().width,
        backgroundColor: '#000000',
        textAlign: 'center'
    }),
    dummy: {
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        verticalAlign: 'middle'
    }
}

module.exports = connect(state=>(state))(Pub);
