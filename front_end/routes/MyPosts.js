import React from 'react';
import { connect } from 'react-redux';
import FeedList from './components/FeedList'
import Loader from './components/Loader'
import update from '../utility/update'

class MyPosts extends React.Component {
    componentDidMount() {
        update('/api/update_user_detail?_id=' + window.user_id);
    }
    render() {
        var { ids } = this.props;
        return ids && <FeedList ids={ids} /> || <Loader/>;
    }
}

export default connect(state=>{
    return {
        ids: state.user_post_ids[window.user_id]
    };
})(MyPosts);
