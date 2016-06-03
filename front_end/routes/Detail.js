import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CssButton from './components/CssButton';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

class Detail extends React.Component {
    constructor() {
        super();
        this.state = {ids: []};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var url = '/api/fetch_detail?openid=' + id;
        showProgress('加载中', fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then((data) => {
                this.setState({ids: data.posts.map((post) => (post._id)), user: data.user});
                return data;
            }).then(createAction('posts'))
            .then(this.props.dispatch)
            .catch(PopupHelper.toast));
    }
    render() {
        var { user, ids } = this.state;
        var { posts } = this.props;
        var user_posts = ids.map((id) => posts[id]);
        return (
            <div className='content'>
                { user && <Helmet title={user.nickname + '的主页'} />}
                { user && <UserTopCard user={user} /> }
                <div style={styles.d3} />
                <FeedList posts={user_posts} />
            </div>
        );
    }
}

module.exports = connect(({posts}) => ({posts}))(Detail);

var styles = {
    d3: {
        width: '100%',
        height: 1,
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
    }
};
