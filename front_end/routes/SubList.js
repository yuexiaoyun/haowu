import React from 'react';
import Helmet from 'react-helmet'
import CommonCard from './components/CommonCard';
import { connect } from 'react-redux'
import { parse_online_json } from '../utility/fetch_utils';
import { hashHistory } from 'react-router';

var SubList = ({ subids, users }) => (
    <div>
        <Helmet title={'订阅我的人'} />
        { subids && subids.map(
            (id) => {
                var user = users[id];
                return <CommonCard
                    user_id={user._id}
                    avatar={user.headimgurl}
                    txt={user.nickname}
                    onClick={()=>(hashHistory.push('detail/'+user._id))}
                />;
            }
        )}
    </div>
);
export default connect(({subids, users}) => ({subids, users}))(SubList);
