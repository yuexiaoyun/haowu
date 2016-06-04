import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CssButton from './components/CssButton';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';
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
        fetch('/api/fetch_detail?openid=' + id, {credentials:'same-origin'})
            .then(parse_online_json)
            .then((data) => {
                try {
                    this.setState({
                        ids: data.posts.map((post) => (post._id)),
                        user: data.user,
                        subbed: data.user.subids && data.user.subids.indexOf(window.openid) >= 0
                    });
                } catch(err) {
                    alert(err);
                }
                return data;
            }).then(createAction('posts'))
            .then(this.props.dispatch)
            .catch((err) => this.setState({err}));
    }
    sub = () => {
        var id = this.props.params.id;
        var url = '/api/sub?openid=' + id;
        showProgress('订阅中', fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(() => {
                this.setState({subbed: true});
                return null;
            })
            .catch(PopupHelper.toast));
    }
    unsub = () => {
        var id = this.props.params.id;
        var url = '/api/unsub?openid=' + id;
        showProgress('取消订阅中', fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(() => {
                this.setState({subbed: false});
                return null;
            })
            .catch(PopupHelper.toast));
    }
    render() {
        var { user, ids, subbed, err } = this.state;
        var { posts } = this.props;
        var user_posts = ids.map((id) => posts[id]);
        return (
            <div>
                { !user && !err && <Loader /> }
                { user && <Helmet title={user.nickname + '的主页'} />}
                { user && <UserTopCard user={user} subbed={subbed} sub={subbed?this.unsub:this.sub}/> }
                { user && <div style={styles.d3} /> }
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
        borderBottom: '1px solid #dfdfdd'
    }
};
