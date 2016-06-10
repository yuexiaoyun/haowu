import React from 'react';
import fconf from '../../fconf';
import CssButton from './CssButton'
import Sound from 'react-sound'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { soundManager } from 'soundmanager2'

class AudioPlayer extends React.Component {
    constructor() {
        super();
        this.state = {i: 3};
    }
    play_audio = (e) => {
        e.stopPropagation();
        var { audio_id, playing } = this.props;
        if (playing) {
            this.stop_play();
        } else {
            this.props.dispatch(createAction('play_sound')(audio_id));
            /*
            var url = '/api/read?' + qs.stringify({
                _id: this.props.post._id
            });
            fetch(url, {credentials: 'same-origin'});
            */
            this.timer = setInterval(this.refresh, 10);
        }
    }
    refresh = () => {
        var { audio_id, playing, sound_playing } = this.props;
        var d = playing ? (new Date() - sound_playing) : 250;
        var i = Math.floor(d / 300) % 3 + 1;
        this.setState({i : i});
        if (!playing)
            clearInterval(this.timer);
    }
    stop_play = () => {
        var { audio_id } = this.props;
        this.props.dispatch(createAction('stop_play')(audio_id));
    }
    render() {
        var { read, length, audio_id, playing } = this.props;
        var { i } = this.state;
        length = Math.floor(length / 1000 + 0.5);
        return (
            <span style={styles.audio(read)} onClick={this.play_audio}>
                <CssButton
                    className={"image-btn_home_play"+ (playing ? i : 3)}
                    width={16}
                    height={16}/>
                <span style={styles.audio_length}>{`${length}"`}</span>
                { playing && <Sound
                    url={fconf.qiniu.site + audio_id + '_mp3'}
                    playStatus={Sound.status.PLAYING}
                    onFinishedPlaying={this.stop_play}
                    /> }
            </span>
        );
    }
}

export default connect((state, props)=>({
    playing: (state.sound_id == props.audio_id),
    sound_playing: state.sound_playing
}))(AudioPlayer);

var styles = {
    audio: (read) => ({
        display: 'inline-block',
        borderRadius: 12,
        height: 24,
        paddingLeft: 6,
        backgroundColor: '#ff6b6b'
    }),
    audio_length: {
        marginLeft: 15,
        lineHeight: '24px',
        color: '#ffffff',
        marginRight: 10
    }
};
