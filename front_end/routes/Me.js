import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CommonCard from './components/CommonCard';
import CssButton from './components/CssButton';
import Loader from './components/Loader';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

class Notifications extends React.Component {
    componentDidMount() {
        var { new_count } = this.props;
        if (new_count > 0)
            fetch('/api/clear_badge', {credentials:'same-origin'});
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('clear_badge2')());
    }
    render() {
        var { notifications, new_count } = this.props;
        return <div>{ notifications && notifications.map(
            (n, i) => {
                return <CommonCard
                    openid={n.openid2}
                    avatar={n.user.headimgurl}
                    txt={`${n.user.nickname} ${n.type=='like' ? '赞' : '订阅'}了你`}
                    pic_id={n.type == 'like' ? n.post.pic_id : null}
                    new_item={i < new_count}
                />;
            }
        )}</div>;
    }
}

class Me extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var { user_post_ids, users } = this.props;
        var ids = user_post_ids[window.openid];
        var user = users[window.openid];
        if (!ids || !user) {
            update('/api/update_me');
        }
        if (this.props.me_scroll)
            window.scrollTop = this.props.me_scroll;
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('me_scroll')(window.scrollTop));
    }
    current_myself_tab = (index) => {
        this.props.dispatch(createAction('current_myself_tab')(index));
    }
    render() {
        var { user_post_ids, users, notifications, current_myself_tab, my_badge, my_badge2 } = this.props;
        var ids = user_post_ids[window.openid];
        var user = users[window.openid];
        var { err } = this.state;
        return (
            <div>
                { user && <UserTopCard user={user} />}
                <div style={styles.d3}>
                    <div style={styles.d30} onClick={()=>this.current_myself_tab(0)}>
                        <div>分享动态</div>
                        { current_myself_tab == 0 && <div style={styles.d30u} /> }
                    </div>
                    <div style={styles.d30} onClick={()=>this.current_myself_tab(1)}>
                        <div>互动区{(my_badge > 0) && <span className="badge">{my_badge}</span>}</div>
                        { current_myself_tab == 1 && <div style={styles.d30u} /> }
                    </div>
                </div>
                { !ids && !err && <Loader /> }
                { current_myself_tab == 0 && ids && <FeedList ids={ids} /> }
                { current_myself_tab == 1 &&
                    <Notifications
                        notifications={notifications}
                        new_count={my_badge2}
                        dispatch={this.props.dispatch}/> }
            </div>
        );
    }
}

module.exports = connect(state=>({
    user_post_ids: state.user_post_ids,
    users: state.users,
    me_scroll: state.me_scroll,
    current_myself_tab: state.current_myself_tab,
    my_badge: state.my_badge,
    my_badge2: state.my_badge2,
    subids: state.subids,
    notifications: state.notifications
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
