import React from 'react';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import setShareInfo from '../utility/set_share_info';
import qs from 'querystring';

import ListContainer from './components/ListContainer';
import Loader from './components/Loader';
import FeedList from './components/FeedList';
import Tabbar from './common/Tabbar';
import TopicCard from './Detail/TopicCard';
import NotificationEntry from './Home/NotificationEntry'

import { hashHistory } from 'react-router';

import { setCurrentTab } from '../ducks/home'
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
        update('/api/update_topics');
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.key != prevProps.location.key
            && this.props.current_tab == 0
            && !this.state.reloading)
            this.reload();
    }
    renderTab0() {
        var { post_list, badge, feed_end, current_tab, dispatch } = this.props;
        var { reloading, err } = this.state;
        return (
            <ListContainer id='feed' hasMore={feed_end == 0} loadMore={this.loadMore}>
                { badge.count > 0 && <NotificationEntry /> }
                { reloading && post_list.length > 0 && <Loader /> }
                <FeedList post_list={post_list} showUser={true}/>
            </ListContainer>
        )
    }
    render() {
        var { post_list, badge, feed_end, current_tab, topic_list, dispatch } = this.props;
        var { reloading, err } = this.state;
        return (
            <div>
                <Tabbar
                    currentTab={current_tab}
                    setCurrentTab={(tab)=>dispatch(setCurrentTab(tab))}
                    tabs={[
                        '热门动态', '精选专辑'
                    ]} />
                { current_tab == 0 && this.renderTab0() }
                { current_tab == 1 && topic_list.map(topic=><TopicCard key={topic._id} topic={topic} />)}
            </div>
        );
    }
}

var get_feed_ids = state => state.home.feed_ids;
var get_feed_end = state => state.home.feed_end;
var get_current_tab = state => state.home.current_tab;
var get_posts = state => state.posts;
var get_badge = state => state.badge;
var get_topic_ids = state => state.home.topic_ids;
var get_topics = state => state.topics;

var get_topic_list = createSelector(
    [get_topic_ids, get_topics],
    (topic_ids, topics) => topic_ids.map(id=>topics[id])
);

var get_post_list = createSelector(
    [get_feed_ids, get_posts],
    (feed_ids, posts) => feed_ids.map(id=>posts[id])
);

var mapStateToProps = createStructuredSelector({
    post_list: get_post_list,
    feed_end: get_feed_end,
    badge: get_badge,
    current_tab: get_current_tab,
    topic_list: get_topic_list
})

module.exports = connect(mapStateToProps, null, null, {withRef: true})(
    Home
);
