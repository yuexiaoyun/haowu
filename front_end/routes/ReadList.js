import React from 'react'
import { connect } from 'react-redux'
import UserList from './components/UserList'
import Loader from './components/Loader'
import update from '../utility/update'

class ReadList extends React.Component {
    componentDidMount() {
        update('/api/update_audio_read_uids?audio_id=' + this.props.params.id);
    }
    render() {
        var {ids, users} = this.props;
        return this.props.ids ?
            <UserList title='听过的人' ids={ids} users={users} /> : <Loader />;
    }
}

export default connect((state, props) => {
    var audio = state.audios[props.params.id];
    return {
        ids: audio && audio.reads || [],
        users: state.users
    }
})(ReadList);
