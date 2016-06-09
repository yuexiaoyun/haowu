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

class Me extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        update('/api/update_me');
    }
    render() {
        var { user, ids, location, children, my_badge } = this.props;
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
                        <div>互动区{(my_badge > 0) && <span className="badge">{my_badge}</span>}</div>
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
    user: state.users[window.openid],
    ids: state.user_post_ids[window.openid],
    my_badge: state.my_badge
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
