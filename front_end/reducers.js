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
    },
    'feed_posts': (state, action) => ({
        ...state,
        feed_posts: action.payload
    }),
    'home_scroll': (state, action) => ({
        ...state,
        home_scroll: action.payload
    }),
    'myself': (state, action) => ({
        ...state,
        myself: action.payload
    }),
    'me_scroll': (state, action) => ({
        ...state,
        me_scroll: action.payload
    }),
    'current_tab': (state, action) => ({
        ...state,
        current_tab: action.payload
    }),
    'refresh': (state, action) => ({
        ...state,
        feed_posts: null,
        home_scroll: null,
        myself: null,
        me_scroll: null
    })
}, {
    current_tab: 0
});
