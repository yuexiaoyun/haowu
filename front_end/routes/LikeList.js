import React from 'react'
import { connect } from 'react-redux'
import UserList from './components/UserList'
import Loader from './components/Loader'
import update from '../utility/update'

class LikeList extends React.Component {
    componentDidMount() {
        update('/api/update_post_like_uids?_id=' + this.props.params.id);
    }
    render() {
        var {ids, users} = this.props;
        return this.props.ids ?
            <UserList title='赞过的人' ids={ids} users={users} /> : <Loader />;
    }
}

export default connect((state, props) => {
    var post = state.posts[props.params.id];
    return {
        ids: post && post.likes || [],
        users: state.users
    }
})(LikeList);
