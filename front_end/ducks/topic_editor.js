import { createAction, handleActions } from 'redux-actions';
import _ from 'underscore';

export default handleActions({
    topic_editor_add: (state, action) => {
        return {
            ...state,
            post_ids: [
                ...state.post_ids,
                action.payload
            ]
        }
    },
    topic_editor_remove: (state, action) => {
        return {
            ...state,
            post_ids: _.filter(state.post_ids, (item)=>(item != action.payload))
        }
    },
    topic_editor_select: (state, action) => {
        return {
            ...state,
            index: action.payload
        }
    },
    topic_editor_set_title: (state, action) => {
        return {
            ...state,
            title: action.payload
        }
    }
}, {
    post_ids: [],
    title: '',
    index: -1
});

export var topicEditorAdd = createAction('topic_editor_add');
export var topicEditorRemove = createAction('topic_editor_remove');
export var topicEditorSelect = createAction('topic_editor_select');
export var topicEditorSetTitle = createAction('topic_editor_set_title');
