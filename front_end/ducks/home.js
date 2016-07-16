import { createAction, handleActions } from 'redux-actions';
import _ from 'underscore';

export default handleActions({
    pub_post: (state, action) => ({
        ...state,
        feed_ids: [
            action.payload.posts[0]._id,
            ...state.feed_ids
        ],
    }),
    delete_post: (state, action) => ({
        ...state,
        feed_ids: _.filter(state.feed_ids, item=>(item!=action.payload))
    }),
    update_feeds: (state, action) => {
        var { posts, concat, feed_end } = action.payload;
        var ids = posts.map(post=>post._id);
        if (concat) {
            return {
                ...state,
                feed_ids: [...state.feed_ids, ...ids],
                feed_end
            }
        } else {
            return {
                ...state,
                feed_ids: [...ids, ...state.feed_ids],
                feed_end
            }
        }
    },
    feed_end: (state, action) => ({
        ...state,
        feed_end: action.payload
    }),
    home_set_current_tab: (state, action) => ({
        ...state,
        current_tab: action.payload
    }),
    update_topics: (state, action) => ({
        ...state,
        topic_ids: action.payload.topics.map(topic=>topic._id)
    })
}, {
    topic_ids: [],
    feed_ids: [],
    feed_end: 0,
    current_tab: 0
});

export var setCurrentTab = createAction('home_set_current_tab');
