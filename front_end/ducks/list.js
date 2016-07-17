import { createAction, handleActions } from 'redux-actions';
import _ from 'underscore';

const LIST_ADD = 'haowu/list/add';
const LIST_APPEND = 'haowu/list/append'

export default handleActions({
    [LIST_ADD]: (state, action) => {
        var { key, list, end } = action.payload;
        return {
            ...state,
            [key]: {
                list,
                end
            }
        }
    },
    [LIST_APPEND]: (state, action) => {
        var { key, list, end } = action.payload;
        var value = state[key] || {
            list: []
        }
        return {
            ...state,
            [key]: {
                list: [...value.list, ...list],
                end
            }
        }
    }
}, {});

export var listSet = createAction(LIST_ADD);
export var listAppend = createAction(LIST_APPEND);
