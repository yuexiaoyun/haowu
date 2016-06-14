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
    return {
        ids: state.post_like_uids.get(props.params.id),
        users: state.users
    }
})(LikeList);
