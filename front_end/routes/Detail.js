import React from 'react';
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CssButton from './components/CssButton';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';

export default class Detail extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var url = '/api/fetch_detail?openid=' + id;
        showProgress('加载中', fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(data => {
                this.setState({posts: data.posts, user: data.user});
                return null;
            }).catch(PopupHelper.toast));
    }
    render() {
        var { user, posts } = this.state;
        return (
            <div>
                { user && <UserTopCard user={user} /> }
                <div style={styles.d3} />
                <FeedList posts={posts} />
            </div>
        );
    }
}

var styles = {
    d3: {
        width: '100%',
        height: 1,
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
    }
};
