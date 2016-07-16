import { handleActions } from 'redux-actions';
import _ from 'underscore';

// 某一个具体语音的听过次数和我是否听过
function update_audios(state, action) {
    var { audios } = action.payload;
    audios = audios.map(audio => {
        var a = state[audio.audio_id] || {};
        audio = {
            ...a,
            ...audio
        }
        return audio;
    });
    return { ...state, ..._.object(audios.map(audio=>audio.audio_id), audios) }
}

export default handleActions({
    update_feeds: update_audios,
    update_user_detail: update_audios,
    update_post_detail: update_audios,
    update_notifications: update_audios,
    update_topic: update_audios,
    update_topics: update_audios,
    read: (state, action) => {
        var { audio_id } = action.payload;
        var audio = state[audio_id];
        if (!audio) {
            audio = {
                me_read: true,
                read_count: 1
            }
        } else if (!audio.me_read){
            audio = {
                ...audio,
                me_read: true,
                read_count: audio.read_count + 1
            }
        }
        return {
            ...state,
            [audio_id]: audio
        };
    },
    update_audio_read_uids: (state, action) => {
        var {audio_id, users, reads} = action.payload;
        var audio = state[audio_id] || {};
        var audio = {
            ...audio,
            audio_id: audio_id,
            me_read: reads.indexOf(window.user_id) >= 0,
            read_count: reads.length,
            reads
        }
        return {
            ...state,
            [audio_id]: audio
        };
    }
}, {});
