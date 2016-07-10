import React from 'react';
import fconf from '../../fconf';
import { createAction } from 'redux-actions'
import classNames from 'classnames'

import styles from './AudioPlayer.css'
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux'

class AudioPlayer extends React.Component {
    play_audio = (e) => {
        e.stopPropagation();
        var { audio_id, post_id, user_id, playing, loading, dispatch } = this.props;
        if (playing || loading) {
            dispatch(createAction('stop')(audio_id));
        } else {
            dispatch(createAction('play')({
                audio_id,
                post_id,
                user_id
            }));
        }
    }
    render() {
        var { read, length, audio_id, playing, loading } = this.props;
        length = Math.floor(length / 1000 + 0.5);
        if (playing)
            var className = "audio-playing";
        else if (!loading)
            var className = "audio";
        else
            var className = 'audio-loading';
        return (
            <span styleName={read ? 'audioplayer-read' : 'audioplayer-unread'} onClick={this.play_audio}>
                <div styleName='audio-loader'>
                    <div styleName={className} />
                </div>
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
        read: audio && audio.me_read
    }
})(
    CSSModules(AudioPlayer, styles)
);
