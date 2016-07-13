import React from 'react'
import UserList from './UserList'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

var get_users = state => state.users;
var get_audio = (state, props) => state.audios[props.params.id];
var get_url = (state, props) => ('/api/update_audio_read_uids?audio_id=' + props.params.id);

var mapStateToProps = createSelector(
    [get_audio, get_url, get_users],
    (audio, url, users) => {
        var ids = audio && audio.reads || null;
        users = ids && ids.map(id=>users[id]) || null;
        return {
            users,
            url,
            title: '听过的人'
        }
    }
)

export default module.exports = connect(mapStateToProps)(
    UserList
);
