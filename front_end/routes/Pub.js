import React from 'react';
import Helmet from 'react-helmet';
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
import CssButton from './components/CssButton';
import PopupHelper from '../utility/PopupHelper';

class Pub extends React.Component {
    constructor() {
        super();
        this.state = {};
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
                                update(url).then(data => {
                                        resolve('发布成功');
                                        hashHistory.go(-1);
                                    }).catch(e => {
                                        resolve('发布失败');
                                    });
                            },
                            fail: res => {
                                resolve('发布失败');
                            }
                        });
                    },
                    fail: res => {
                        resolve('发布失败');
                    }
                });
            }));
        }
    }
    // TODO: 发布流程的界面还需要再调一下
    render() {
        var pic_id = this.props.local_pic_id;
        return (
            <div>
                <Helmet title={'发布好物'} />
                <div style={styles.image_d()}>
                    <span style={styles.dummy} />
                    <img src={pic_id} style={styles.image}/>
                </div>
                <Recorder onData={data=>this.setState(data)}/>
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
