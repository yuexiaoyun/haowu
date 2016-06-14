import React from 'react';
import Helmet from 'react-helmet'
import CommonCard from './CommonCard';
import { hashHistory } from 'react-router';

export default ({ title, ids, users }) => (
    <div>
        <Helmet title={title} />
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
