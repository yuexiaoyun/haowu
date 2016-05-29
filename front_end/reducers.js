const initialState = {
}

module.exports = function(state = initialState, action) {
    if (action.type == 'take_pic') {
        return {
            ...state,
            local_pic_id: action.id
        };
    } else if (action.type == 'play_sound') {
        return {
            ...state,
            sound_id: action.id
        }
    } else if (action.type == 'stop_play') {
        if (action.id == state.sound_id) {
            return {
                ...state,
                sound_id: null
            }
        } else {
            return state;
        }
    }
    return state;
}
