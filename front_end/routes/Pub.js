import React from 'react';

export default class Pub extends React.Component {
    render() {
        return (
            <div className="wxapi_container">
                <div className="lbox_close wxapi_form">
                    <img id="pic_show" src="" width="100%" style={{display: 'none'}}/>
                    <button className="btn btn_primary" id="pic">拍照</button>
                    <span className="desc">添加一段语音描述</span>
                    <button className="btn btn_primary" id="audio_play" style={{display: 'none'}}>播放刚才录制的语音</button>
                    <button className="btn btn_primary" id="audio">开始录音</button>
                </div>
            </div>
        );
    }
}
