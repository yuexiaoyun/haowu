import React from 'react';
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import Loader from './components/Loader';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

import { createSelector, createStructuredSelector } from 'reselect';
import styles from './Detail.css'
import CSSModules from 'react-css-modules';

class Detail extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var { user } = this.props;
        var url = '/api/update_user_detail?_id=' + id;
        update(url)
            .catch((err) => this.setState({err}));
        if (user)
            window.setTitle(user.nickname + '的主页');
    }
    componentDidUpdate() {
        var { user } = this.props;
        if (user) {
            window.setTitle(user.nickname + '的主页');
        }
    }
    render() {
        var { user, post_ids } = this.props;
        var { err } = this.state;
        return (
            <div>
                { user && <UserTopCard user={user} /> }
                <div styleName='d3' />
                { !post_ids && !err && <Loader /> }
                { post_ids && post_ids.length > 0 && <FeedList ids={post_ids} /> }
            </div>
        );
    }
}

var get_user = (state, props) => state.users[props.params.id];
var get_post_ids = (state, props) => state.user_post_ids[props.params.id];

var mapStateToProps = createStructuredSelector({
    user: get_user,
    post_ids: get_post_ids
});

export default connect(mapStateToProps)(
    CSSModules(Detail, styles)
);
