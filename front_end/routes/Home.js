import React from 'react';
import FeedList from './components/FeedList';
import { parse_online_json } from '../utility/fetch_utils';
import Loader from './components/Loader';
import screenSize from '../utility/screen_size';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import InfiniteScroll from 'react-infinite-scroller';
import qs from 'querystring';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        if (this.props.home_scroll) {
            window.scrollTop = this.props.home_scroll;
        }
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('home_scroll')(window.scrollTop));
    }
    loadMore = (page) => {
        var url;
        if (this.props.feed_ids.length == 0) {
            url = '/api/fetch_posts';
        } else {
            url = '/api/fetch_posts?' + qs.stringify({
                beforeid: this.props.feed_ids[this.props.feed_ids.length - 1]
            });
        }
        fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(createAction('feed_posts'))
            .then(this.props.dispatch)
            .catch((err) => this.setState({err}));
    }
    reload = () => {
        if (this.props.feed_ids.length > 0 && this.props.feed_reloading != 1) {
            this.props.dispatch(createAction('feed_reloading')(1));
            fetch('/api/fetch_posts', {credentials:'same-origin'})
                .then(parse_online_json)
                .then(createAction('feed_posts', (data)=>data, ()=>'reload'))
                .then(this.props.dispatch)
                .catch(()=>this.props.dispatch(createAction('feed_reloading')(0)));
        }
        document.body.scrollTop = 0;
    }
    render() {
        var { posts, feed_ids, feed_end, feed_reloading } = this.props;
        var { err } = this.state;
        var feed_posts = feed_ids.map((id) => posts[id]);
        return (
            <InfiniteScroll threshold={1080} hasMore={feed_end == 0} loadMore={this.loadMore}>
                { feed_reloading == 1 && feed_ids.length > 0 && <Loader /> }
                <FeedList posts={feed_posts} showUser={true}/>
                { feed_end == 0 && !err && <Loader /> }
            </InfiniteScroll>
        );
    }
}

module.exports = connect(({feed_ids, posts, feed_end, home_scroll, feed_reloading})=>({
    feed_ids,
    posts,
    feed_end,
    home_scroll,
    feed_reloading
}), null, null, {withRef: true})(Home);
