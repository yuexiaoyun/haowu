import React from 'react';
import CommonCard from './CommonCard';
import { hashHistory } from 'react-router';

export default class UserList extends React.Component {
    componentDidMount() {
        window.setTitle(this.props.title);
    }
    render() {
        var { ids, users } = this.props;
        return (
            <div>
                { ids && ids.map(
                    (id) => {
                        var user = users[id];
                        return <CommonCard
                            key={user._id}
                            user_id={user._id}
                            avatar={user.headimgurl}
                            txt={user.nickname}
                            onClick={()=>(hashHistory.push('detail/'+user._id))}
                        />;
                    }
                )}
            </div>
        );
    }
}
