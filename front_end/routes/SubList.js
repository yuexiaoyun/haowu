import React from 'react';
import Helmet from 'react-helmet'
import CommonCard from './components/CommonCard';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';
import { Link, hashHistory } from 'react-router';

export default class SubList extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        if (!this.props.myself) {
            var url = '/api/fetch_subs';
            showProgress('加载中', fetch(url, {credentials:'same-origin'})
                .then(parse_online_json)
                .then(data=>{
                    this.setState({users: data.users});
                })
                .catch(PopupHelper.toast));
        }
    }
    render() {
        var { users } = this.state;
        return (
            <div>
                <Helmet title={'订阅我的人'} />
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
