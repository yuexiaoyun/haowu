import React from 'react';
import { connect } from 'react-redux';
import FeedList from './components/FeedList'
import Loader from './components/Loader'
import update from '../utility/update'

class MyPosts extends React.Component {
    render() {
        var { ids } = this.props;
        if (ids) {
            return ids.length && <FeedList ids={ids} /> || (
                <div></div>
            );
        } else {
            return <Loader />;
        }
    }
}

export default connect(state=>{
    return {
        ids: state.user_post_ids[window.user_id]
    };
})(MyPosts);
