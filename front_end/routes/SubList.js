import React from 'react';
import Helmet from 'react-helmet'
import CommonCard from './components/CommonCard';
import Loader from './components/Loader';
import { parse_online_json } from '../utility/fetch_utils';
import { hashHistory } from 'react-router';

export default class SubList extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        fetch('/api/fetch_subs', {credentials:'same-origin'})
            .then(parse_online_json)
            .then((data) => this.setState(data))
            .catch((err) => this.setState({err}))
    }
    render() {
        var { users, err } = this.state;
        return (
            <div>
                <Helmet title={'订阅我的人'} />
                { !users && !err && <Loader /> }
                { users && users.map(
                    (user) => {
                        return <CommonCard
                            openid={user.openid}
                            avatar={user.headimgurl}
                            txt={user.nickname}
                            onClick={()=>(hashHistory.push('detail/'+user.openid))}
                        />;
                    }
                )}
            </div>
        );
    }
}
