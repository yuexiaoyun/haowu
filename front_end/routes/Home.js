import React from 'react';
import FeedList from './components/FeedList';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';
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
        var f;
        if (this.props.feed_ids.length == 0) {
            url = '/api/fetch_posts';
            f = (p) => {
                showProgress('加载中', p);
            }
        } else {
            url = '/api/fetch_posts?' + qs.stringify({
                beforeid: this.props.feed_ids[this.props.feed_ids.length - 1]
            });
            f = (p) => (p);
        }
        f(fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(createAction('feed_posts'))
            .then(this.props.dispatch)
            .catch(PopupHelper.toast));
    }
    render() {
        var { posts, feed_ids, feed_end } = this.props;
        var feed_posts = feed_ids.map((id) => posts[id]);
        return (
            <InfiniteScroll threshold={1080} hasMore={feed_end == 0} loadMore={this.loadMore} Loader={<div></div>}>
                <FeedList posts={feed_posts} showUser={true}/>
            </InfiniteScroll>
        );
    }
}

module.exports = connect(({feed_ids, posts, feed_end, home_scroll})=>({
    feed_ids,
    posts,
    feed_end,
    home_scroll
}))(Home);
