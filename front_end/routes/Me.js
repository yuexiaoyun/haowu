import React from 'react';
import { Link, hashHistory } from 'react-router';
import UserTopCard from './components/UserTopCard';
import Loader from './components/Loader';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { get_badge_count } from '../reselectors';

class Me extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        var { user, ids, location, children, badge_count } = this.props;
        var { err } = this.state;
        return (
            <div>
                { user && <UserTopCard user={user} />}
                <div className='tab'>
                    <div className='tab-item' onClick={()=>hashHistory.replace('/me/posts')}>
                        <div>分享动态</div>
                        { location.pathname=='/me/posts' && <div className='active' /> }
                    </div>
                    <div className='tab-item' onClick={()=>hashHistory.replace('/me/notifications')}>
                        <div>互动区{(badge_count > 0) && <span className="badge">{badge_count}</span>}</div>
                        { location.pathname=='/me/notifications' && <div className='active' /> }
                    </div>
                </div>
                { children }
            </div>
        );
    }
}

module.exports = connect(state=>({
    user: state.users[window.user_id],
    ids: state.user_post_ids[window.user_id],
    badge_count: get_badge_count(state)
}))(Me);
