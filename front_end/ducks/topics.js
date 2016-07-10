import { handleActions } from 'redux-actions';

export default handleActions({
    update_topic: (state, action) => {
        var { topic } = action.payload;
        return {
            ...state,
            [topic._id]: topic
        }
    },
}, {});
