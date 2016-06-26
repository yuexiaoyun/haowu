import React from 'react';
import setShareInfo from '../../utility/set_share_info';
import update from '../../utility/update'

import Loader from '../components/Loader';
import UserCard from './UserCard';
import EmptyView from '../common/EmptyView'

export default class UserList extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        window.setTitle(this.props.title);
        setShareInfo();
        this.load();
    }
    load = () => {
        var { url } = this.props;
        if (url) {
            this.setState({err: null});
            update(url).catch((err) => this.setState({err}));
        }
    }
    render() {
        var { users } = this.props;
        var { err } = this.state;
        if (users) {
            return (
                <div>
                    { users.map((user) => <UserCard key={user._id} user={user} />) }
                </div>
            );
        } else if (!err ){
            return <Loader />;
        } else {
            return <EmptyView emptyText='加载失败，点击重试' onClick={this.load} />;
        }
    }
}
