import React from 'react';
import setShareInfo from '../../utility/set_share_info';
import update from '../../utility/update'

import ListContainer from '../components/ListContainer';
import UserCard from './UserCard';

export default class UserList extends React.Component {
    componentDidMount() {
        this.setTitle();
    }
    componentDidUpdate() {
        this.setTitle();
    }
    setTitle = () => {
        var { title } = this.props;
        if (title)
            window.setTitle(title);
        setShareInfo();
    }
    load = () => {
        var { url } = this.props;
        if (url) {
            return update(url);
        }
    }
    render() {
        var { users, url } = this.props;
        return (
            <ListContainer id={url} hasMore={!users} loadMore={this.load}>
                { users && users.map((user) => <UserCard key={user._id} user={user} />) }
            </ListContainer>
        );
    }
}
