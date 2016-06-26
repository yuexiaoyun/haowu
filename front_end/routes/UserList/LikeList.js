import React from 'react'
import UserList from './UserList'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { get_users } from '../../reselectors'

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

var get_post = (state, props) => state.posts[props.params.id];
var get_url = (state, props) => ('/api/update_post_like_uids?_id=' + props.params.id);

var mapStateToProps = createSelector(
    [get_post, get_url, get_users],
    (post, url, users) => {
        var ids = post && post.likes || null;
        users = ids && ids.map(id=>users[id]) || null;
        return {
            users,
            url,
            title: '赞过的人'
        }
    }
)

export default connect(mapStateToProps)(
    UserList
);