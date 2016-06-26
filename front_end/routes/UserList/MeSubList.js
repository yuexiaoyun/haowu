import React from 'react';
import UserList from './UserList'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { get_users } from '../../reselectors'

var mapStateToProps = createSelector(
    [get_users],
    (users) => {
        var user = users[window.user_id];
        var ids = user && user.me_subids || [];
        users = ids.map(id=>users[id]);
        return {
            users,
            title: '我订阅的人'
        }
    }
)

export default connect(mapStateToProps)(
    UserList
);