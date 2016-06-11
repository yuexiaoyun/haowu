import React from 'react';
import { connect } from 'react-redux';
import FeedList from './components/FeedList'

var MyPosts = ({ids}) => (<FeedList ids={ids} />);
export default connect(state=>{
    return {
        ids: state.user_post_ids[window.user_id]
    };
})(MyPosts);
