import { createAction, handleActions } from 'redux-actions';
import fconf from '../fconf';
import { read } from '../actions';

export default handleActions({
    set_playlist: (state, action) => ({
        ...state,
        playlist: action.payload
    }),
    play: (state, action) => ({
        playlist: state.playlist,
        id: action.payload.audio_id,
        play_state: 'loading'
    }),
    onPlay: (state, action) => ({
        playlist: state.playlist,
        id: state.id,
        play_state: 'playing',
        start: new Date(),
        time: 0
    }),
    onTimeupdate: (state, action) => ({
        playlist: state.playlist,
        id: state.id,
        play_state: 'playing',
        start: state.start,
        time: new Date() - state.start
    }),
    onEnded: (state, action) => ({
        playlist: state.playlist
    })
}, {});

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
        var { playlist, id } = store.getState().audio_player;
        if (playlist) {
            console.log(playlist);
            for (var i = 0; i < playlist.length; i++) {
                var item = playlist[i];
                if (item.audio_id == id) {
                    i++;
                    if (i < playlist.length) {
                        console.log(i);
                        // iOS和Android的限制，ended的时候必须立即开始播放下一个，否则连播会失效
                        console.log(playlist[i]);
                        store.dispatch(createAction('play')(playlist[i]));
                        return;
                    }
                }
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
        }
        return next(action);
    }
}
