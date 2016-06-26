import React from 'react';
import UserList from './UserList'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { get_subids, get_users } from '../../reselectors'

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

export default connect(mapStateToProps)(
    UserList 
);
