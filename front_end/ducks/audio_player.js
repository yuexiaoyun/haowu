import { createAction, handleActions } from 'redux-actions';
import fconf from '../fconf';
import { read } from '../actions';

export default handleActions({
    set_playlist: (state, action) => ({
        ...state,
        playlist: action.payload
    }),
    set_index: (state, action) => ({
        ...state,
        index: action.payload.index
    }),
    play: (state, action) => ({
        playlist: state.playlist,
        index: state.index,
        id: action.payload.audio_id,
        play_state: 'loading'
    }),
    onPlay: (state, action) => ({
        playlist: state.playlist,
        index: state.index,
        id: state.id,
        play_state: 'playing',
        start: new Date(),
        time: 0
    }),
    onTimeupdate: (state, action) => ({
        playlist: state.playlist,
        index: state.index,
        id: state.id,
        play_state: 'playing',
        start: state.start,
        time: new Date() - state.start
    }),
    onEnded: (state, action) => ({
        playlist: state.playlist,
        index: state.index
    })
}, {
    index: 0
});

export var audioPlayerMiddleware = store => next => {
    var player = new Audio();
    player.addEventListener('canplaythrough', ()=>{
        player.play();
    });
    player.addEventListener('play', ()=>{
        store.dispatch(createAction('onPlay')());
    });
    player.addEventListener('timeupdate', ()=>{
        store.dispatch(createAction('onTimeupdate')());
    });
    player.addEventListener('ended', ()=>{
        var { playlist, id, index } = store.getState().audio_player;
        if (playlist) {
            var item = playlist[index];
            if (item.audio_id == id) {
                index++;
                if (index < playlist.length) {
                    store.dispatch(createAction('set_index')({
                        index,
                        play: true
                    }));
                } else {
                    store.dispatch(createAction('set_index')({
                        index: 0,
                        play: false
                    }));
                }
                return;
            }
        }
        store.dispatch(createAction('onEnded')());
    });
    return action => {
        if (action.type == 'play') {
            var { audio_id, user_id, post_id } = action.payload;
            player.src = fconf.qiniu.site + audio_id + '_mp3';
            player.load();
            store.dispatch(read({
                audio_id,
                post_id,
                user_id
            }));
        } else if (action.type == 'stop') {
            var audio_id = action.payload;
            player.pause();
            player.src = null;
            store.dispatch(createAction('onEnded')());
        } else if (action.type == 'set_index') {
            var { index, play } = action.payload;
            var { playlist } = store.getState().audio_player;
            if (play) {
                store.dispatch(createAction('play')(playlist[index]));
            }
        }
        return next(action);
    }
}
