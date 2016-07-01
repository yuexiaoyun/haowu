import React from 'react';
import FeedList from './components/FeedList';
import { parse_online_json } from '../utility/fetch_utils';
import Loader from './components/Loader';
import update from '../utility/update';
import setShareInfo from '../utility/set_share_info';
import InfiniteScroll from 'react-infinite-scroller';
import qs from 'querystring';

import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { createSelector, createStructuredSelector } from 'reselect';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            reloading: false
        };
    }
    widthNDpr = () => {
        return qs.stringify({
            dpr: window.devicePixelRatio,
            width: window.innerWidth
        })
    }
    loadMore = (page) => {
        var { post_list } = this.props;
        if (post_list.length == 0) {
            update('/api/update_feeds?min=10&' + this.widthNDpr());
        } else {
            update('/api/update_feeds?beforeid=' + post_list[post_list.length - 1]._id + '&' + this.widthNDpr());
        }
    }
    reload = () => {
        console.log(this.widthNDpr());
        this.setState({reloading: true});
        update('/api/update_feeds?' + this.widthNDpr())
            .then(()=>this.setState({reloading: false}));
    }
    componentDidMount() {
        window.setTitle('物记');
        setShareInfo();
    }
    componentDidUpdate(prevProps) {
        // 用户当前在首页，又点了一次底部TAB
        if (this.props.params.time != prevProps.params.time && !this.state.reloading)
            this.reload();
    }
    render() {
        var { post_list, feed_end } = this.props;
        var { reloading, err } = this.state;
        return (
            <InfiniteScroll hasMore={feed_end == 0} loadMore={this.loadMore}>
                { reloading && post_list.length > 0 && <Loader /> }
                <FeedList post_list={post_list} showUser={true}/>
                { feed_end == 0 && !err && <Loader /> }
            </InfiniteScroll>
        );
    }
}

var get_feed_ids = state => state.feed_ids;
var get_feed_end = state => state.feed_end;
var get_posts = state => state.posts;

var get_post_list = createSelector(
    [get_feed_ids, get_posts],
    (feed_ids, posts) => feed_ids.map(id=>posts[id])
);

var mapStateToProps = createStructuredSelector({
    post_list: get_post_list,
    feed_end: get_feed_end
})

module.exports = connect(mapStateToProps, null, null, {withRef: true})(
    Home
);
