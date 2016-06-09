import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CssButton from './components/CssButton';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import Loader from './components/Loader';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

class Detail extends React.Component {
    constructor() {
        super();
        this.state = {ids: []};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var url = (id == window.openid) ? '/api/update_me' : '/api/update_user_detail?openid=' + id;
        update(url)
            .catch((err) => this.setState({err}));
    }
    render() {
        var id = this.props.params.id;
        var { posts, users, user_post_ids } = this.props;
        var { err } = this.state;
        var user = users[id];
        var ids = user_post_ids[id];
        return (
            <div>
                <Helmet title={user.nickname + '的主页'} />
                <UserTopCard user={user} />
                <div style={styles.d3} />
                { !ids && !err && <Loader /> }
                { ids && <FeedList ids={ids} /> }
            </div>
        );
    }
}

module.exports = connect(({posts, users, user_post_ids}) => ({posts, users, user_post_ids}))(Detail);

var styles = {
    d3: {
        width: '100%',
        height: 1,
        borderBottom: '1px solid #dfdfdd'
    }
};
