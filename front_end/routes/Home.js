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

        if (!this.props.feed_posts) {
            url = '/api/fetch_posts';
            f = (p) => {
                showProgress('加载中', p);
            }
        } else {
            url = '/api/fetch_posts?' + qs.stringify({
                beforeid: this.props.feed_posts[this.props.feed_posts.length - 1]._id
            });
            f = (p) => (p);
        }
        f(fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(data => {
                try {
                    this.props.dispatch(createAction('feed_posts')(data.posts));
                    return null;
                } catch(err) {
                    alert(err);
                }
            }));
    }
    render() {
        return (
            <InfiniteScroll threshold={1080} hasMore={!this.props.feed_end} loadMore={this.loadMore} Loader={<div></div>}>
                {this.props.feed_posts && <FeedList posts={this.props.feed_posts} />}
            </InfiniteScroll>
        );
    }
}

module.exports = connect(state=>({
    feed_posts: state.feed_posts,
    feed_end: state.feed_end,
    home_scroll: state.home_scroll
}))(Home);
