import React from 'react';
import UserList from './UserList'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

var get_subids = state => state.subids;
var get_users = state => state.users;

var mapStateToProps = createSelector(
    [get_subids, get_users],
    (subids, users) => {
        users = subids.map(id=>users[id]);
        return {
            users,
            title: '订阅我的人'
        }
    }
)

export default module.exports = connect(mapStateToProps)(
    UserList
);
