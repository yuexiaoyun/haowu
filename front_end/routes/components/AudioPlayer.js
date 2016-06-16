import React from 'react';
import fconf from '../../fconf';
import * as actions from '../../actions';
import CssButton from './CssButton'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { play, stop } from '../../utility/audio_manager'
import classNames from 'classnames'

class AudioPlayer extends React.Component {
    componentWillUnmount() {
        if (this.props.playing || this.props.loading)
            this.stop_play();
    }
    play_audio = (e) => {
        e.stopPropagation();
        var { audio_id, playing, loading } = this.props;
        if (playing || loading)
            this.stop_play();
        else
            play(audio_id);
    }
    stop_play = () => {
        var { audio_id } = this.props;
        stop(audio_id);
    }
    render() {
        var { read, length, audio_id, playing, loading, i } = this.props;
        length = Math.floor(length / 1000 + 0.5);
        if (playing)
            var className = " image-btn_home_play" + i;
        else if (!loading)
            var className = " image-btn_home_play3";
        else
            var className = ' image-btn_home_play3';
        return (
            <span className={classNames({
                audioplayer: true,
                'audioplayer-unread': !read,
                'audioplayer-read': read
            }) + className } onClick={this.play_audio}>
                {`${length}"`}
            </span>
        );
    }
}

export default connect((state, props)=>{
    var audio = state.audios[props.audio_id];
    var { id, play_state, time } = state.audio_player;
    var playing = (id == props.audio_id && play_state == 'playing');
    var loading = (id == props.audio_id && play_state == 'loading');
    return {
        playing,
        loading,
        i: (playing && time && (Math.floor(time / 300) % 3 + 1) : 3),
        read: audio && audio.me_read
    }
})(AudioPlayer);
