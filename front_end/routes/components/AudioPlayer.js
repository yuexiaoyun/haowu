import React from 'react';
import fconf from '../../fconf';
import * as actions from '../../actions';
import CssButton from './CssButton'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { play, stop } from '../../utility/audio_manager'

class AudioPlayer extends React.Component {
    play_audio = (e) => {
        e.stopPropagation();
        var { audio_id, playing } = this.props;
        if (playing)
            this.stop_play();
        else
            play(audio_id);
    }
    stop_play = () => {
        e.stopPropagation();
        var { audio_id } = this.props;
        stop(audio_id);
    }
    render() {
        var { read, length, audio_id, playing, i } = this.props;
        length = Math.floor(length / 1000 + 0.5);
        if (playing)
            var className = "image-btn_home_play" + i;
        else
            var className = read ? 'image-btn_home_play3' : "image-btn_home_play_weidu";
        return (
            <span className={`audioplayer ${className}`} onClick={this.play_audio}>
                {`${length}"`}
            </span>
        );
    }
}

export default connect((state, props)=>{
    var { reads } = state;
    var { id, play_state, time } = state.audio_player;
    var playing = (id == props.audio_id && play_state == 'playing');
    return {
        playing,
        i: (playing && time && (Math.floor(time / 300) % 3 + 1) : 3),
        read: reads.has(props.audio_id)
    }
})(AudioPlayer);
