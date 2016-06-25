import React from 'react';
import { Link, hashHistory } from 'react-router';
import UserTopCard from './components/UserTopCard';
import Loader from './components/Loader';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

class Me extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        window.setTitle('物记');
        update('/api/update_user_detail?_id=' + window.user_id);
    }
    render() {
        var { user, location, children } = this.props;
        var { err } = this.state;
        return (
            <div>
                { user && <UserTopCard user={user} pathname={location.pathname}/>}
                { user && <div className='tab'>
                    <div className='tab-item' onClick={()=>hashHistory.replace('/me/posts')}>
                        <div>分享动态</div>
                        { location.pathname=='/me/posts' && <div className='active' /> }
                    </div>
                    <div className='tab-item' onClick={()=>hashHistory.replace('/me/notifications')}>
                        <div>互动区</div>
                        { location.pathname=='/me/notifications' && <div className='active' /> }
                    </div>
                </div> }
                { children }
            </div>
        );
    }
}

module.exports = connect(state=>({
    user: state.users[window.user_id]
}))(Me);
