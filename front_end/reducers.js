const initialState = {
}

module.exports = function(state = initialState, action) {
    if (action.type == 'take_pic') {
        return {
            ...state,
            local_pic_id: action.id
        };
    }
    return state;
}
