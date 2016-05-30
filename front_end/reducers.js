import { handleActions } from 'redux-actions';

module.exports = handleActions({
    'take_pic': (state, action) => ({
        ...state,
        local_pic_id: action.payload
    }),
    'play_sound': (state, action) => ({
        ...state,
        sound_id: action.payload,
        sound_playing: new Date()
    }),
    'stop_play': (state, action) => {
        if (action.payload == state.sound_id) {
            return {
                ...state,
                sound_id: null
            }
        } else {
            return state;
        }
    }
}, {});
