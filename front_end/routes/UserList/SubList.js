import React from 'react';
import UserList from './UserList'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

var get_users = state => state.users;
var get_user = (state, props) => state.users[props.params.id];
var get_sub_list = (state, props) => state.list[`sub_list/${props.params.id}`];
var get_url = (state, props) => '/api/update_sub_list?_id=' + props.params.id;

var mapStateToProps = createSelector(
    [get_users, get_user, get_sub_list, get_url],
    (users, user, sub_list, url) => {
        var subids = sub_list && sub_list.list || null;
        users = subids && subids.map(id=>users[id]) || null;
        if (user) {
            var title = user._id == window.user_id ? '我订阅的人' : `${user.nickname}订阅的人`;
        }
        return {
            url,
            users,
            title
        }
    }
)

export default module.exports = connect(mapStateToProps)(
    UserList
);
