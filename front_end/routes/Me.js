import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import UserTopCard from './components/UserTopCard';
import CssButton from './components/CssButton';
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
                <div style={styles.d3}>
                    <div style={styles.d30} onClick={()=>hashHistory.replace('/me/posts')}>
                        <div>分享动态</div>
                        { location.pathname=='/me/posts' && <div style={styles.d30u} /> }
                    </div>
                    <div style={styles.d30} onClick={()=>hashHistory.replace('/me/notifications')}>
                        <div>互动区{(badge_count > 0) && <span className="badge">{badge_count}</span>}</div>
                        { location.pathname=='/me/notifications' && <div style={styles.d30u} /> }
                    </div>
                </div>
                { !ids && !err && <Loader /> }
                { ids && children }
            </div>
        );
    }
}

module.exports = connect(state=>({
    user: state.users[window.user_id],
    ids: state.user_post_ids[window.user_id],
    badge_count: get_badge_count(state)
}))(Me);

var styles = {
    d3: {
        display: 'table',
        width: '100%',
        height: 44,
        tableLayout: 'fixed',
        borderTop: '1px solid #dfdfdd',
        borderBottom: '1px solid #dfdfdd'
    },
    d30: {
        position: 'relative',
        display: 'table-cell',
        paddingTop: 12,
        textAlign: 'center',
        color: '#666666',
        fontSize: 14
    },
    d30u: {
        margin: '0px auto',
        backgroundColor: '#666666',
        width: 60,
        height: 2
    }
};
