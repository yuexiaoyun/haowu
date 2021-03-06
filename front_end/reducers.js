import { handleActions } from 'redux-actions';
import _ from 'underscore';

export audio_player from './ducks/audio_player';
export posts from './ducks/posts';
export users from './ducks/users';
export audios from './ducks/audios';
export topics from './ducks/topics';
export topic_editor from './ducks/topic_editor';
export user_post_ids from './ducks/user_post_ids';
export user_topic_ids from './ducks/user_topic_ids';
export route_state from './ducks/route_state';
export local_pic_id from './ducks/local_pic_id';
export post_details from './ducks/post_details';
export home from './ducks/home';
export list from './ducks/list';

// 自己的通知列表
export var notifications = handleActions({
    update_notifications: (state, action) => {
        var { notifications, concat } = action.payload;
        if (concat)
            return [...state, ...notifications];
        else
            return notifications
    },
    clear_notifications: (state, action) => [],
    delete_post: (state, action) => _.filter(state, item=>(item.target!=action.payload))
}, []);

export var notification_end = handleActions({
    update_notifications: (state, action) => action.payload.notification_end || 0,
    clear_notifications: (state, action) => 0
}, 0);

export var badge = handleActions({
    update_badge: (state, action) => ({
        count: action.payload.count,
        uid: action.payload.users.length > 0 ? action.payload.users[0]._id : null
    })
}, {});

export var tooltip = handleActions({
    update_tooltip: (state, action) => action.payload
}, 0);

export var close_clicked = handleActions({
    update_close_clicked: (state, action) => action.payload
}, 0);

export var pendings = handleActions({
    LOADING_START: (state, action) => ({
        ...state,
        [action.payload.id]: { err: null }
    }),
    LOADING_SUCCESS: (state, action) => ({
        ...state,
        [action.payload.id]: null
    }),
    LOADING_FAILED: (state, action) => ({
        ...state,
        [action.payload.id]: { err: 1 }
    })
}, {})
