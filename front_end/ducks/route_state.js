import {handleActions } from 'redux-actions';

export default handleActions({
    set_route_state: (state, action) => {
        var { key, value } = action.payload;
        var prevValue = state[key];
        if (prevValue) {
            value = {
                ...prevValue,
                ...value
            }
        }
        return {
            ...state,
            [key]: value
        }
    }
}, {});
