import React from 'react';
import { connect } from 'react-redux'
import UserList from './components/UserList'

export default connect(({users}) => {
    var user = users[window.user_id];
    console.log(user);
    var ids = user && user.me_subids || [];
    return {
        ids,
        users,
        title: '我订阅的人'
    }
})(UserList);
