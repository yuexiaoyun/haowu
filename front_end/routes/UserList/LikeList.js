import React from 'react'
import UserList from './UserList'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

var get_users = state => state.users;
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

export default module.exports = connect(mapStateToProps)(
    UserList
);
