import React from 'react';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import setShareInfo from '../utility/set_share_info';
import qs from 'querystring';

import ListContainer from './components/ListContainer';
import Loader from './components/Loader';
import FeedList from './components/FeedList';
import NotificationEntry from './Home/NotificationEntry'

import { hashHistory } from 'react-router';

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
    loadMore = () => {
        var { post_list } = this.props;
        if (post_list.length == 0) {
            return update('/api/update_feeds?min=10&' + this.widthNDpr());
        } else {
            return update('/api/update_feeds?beforeid=' + post_list[post_list.length - 1]._id + '&' + this.widthNDpr());
        }
    }
    reload = () => {
        console.log(this.widthNDpr());
        if (!this.state.reloading) {
            this.setState({reloading: true});
            update('/api/update_feeds?' + this.widthNDpr())
                .then(()=>this.setState({reloading: false}));
        }
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
        var { post_list, badge, feed_end } = this.props;
        var { reloading, err } = this.state;
        return (
            <ListContainer hasMore={feed_end == 0} loadMore={this.loadMore}>
                { badge.count > 0 && <NotificationEntry /> }
                { reloading && post_list.length > 0 && <Loader /> }
                <FeedList post_list={post_list} showUser={true}/>
            </ListContainer>
        );
    }
}

var get_feed_ids = state => state.feed_ids;
var get_feed_end = state => state.feed_end;
var get_posts = state => state.posts;
var get_badge = state => state.badge;

var get_post_list = createSelector(
    [get_feed_ids, get_posts],
    (feed_ids, posts) => feed_ids.map(id=>posts[id])
);

var mapStateToProps = createStructuredSelector({
    post_list: get_post_list,
    feed_end: get_feed_end,
    badge: get_badge
})

module.exports = connect(mapStateToProps, null, null, {withRef: true})(
    Home
);
