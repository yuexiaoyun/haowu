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
        if (ids) {
            return ids.length && <FeedList ids={ids} /> || (
                <div className='empty image-image_404'>
                    <div>我还没有发布任何一件好物</div>
                    <div>这块空地好孤单</div>
                </div>
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
