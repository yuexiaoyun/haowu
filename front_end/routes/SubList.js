import React from 'react';
import { connect } from 'react-redux'
import UserList from './components/UserList'

export default connect(({subids, users}) => ({
    subids,
    users,
    title: '订阅我的人'
}))(UserList);
