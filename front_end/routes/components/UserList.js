import React from 'react';
import UserCard from './UserCard';
import setShareInfo from '../../utility/set_share_info';
import { hashHistory } from 'react-router';

export default class UserList extends React.Component {
    componentDidMount() {
        window.setTitle(this.props.title);
        setShareInfo();
    }
    render() {
        var { ids, users } = this.props;
        return (
            <div>
                { ids && ids.map(
                    (id) => {
                        var user = users[id];
                        return <UserCard
                            key={user._id}
                            user={user}
                        />;
                    }
                )}
            </div>
        );
    }
}
