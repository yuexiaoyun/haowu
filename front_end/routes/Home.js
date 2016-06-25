import React from 'react';
import FeedList from './components/FeedList';
import { parse_online_json } from '../utility/fetch_utils';
import Loader from './components/Loader';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import update from '../utility/update';
import setShareInfo from '../utility/set_share_info';
import InfiniteScroll from 'react-infinite-scroller';
import qs from 'querystring';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            reloading: false
        };
    }
    loadMore = (page) => {
        var { feed_ids } = this.props;
        if (feed_ids.length == 0) {
            update('/api/update_feeds?min=10');
        } else {
            update('/api/update_feeds?beforeid=' + feed_ids[feed_ids.length - 1]);
        }
    }
    reload = () => {
        this.setState({reloading: true});
        update('/api/update_feeds')
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
        var { feed_ids, feed_end } = this.props;
        var { reloading, err } = this.state;
        return (
            <InfiniteScroll hasMore={feed_end == 0} loadMore={this.loadMore}>
                { reloading && feed_ids.length > 0 && <Loader /> }
                <FeedList ids={feed_ids} showUser={true}/>
                { feed_end == 0 && !err && <Loader /> }
            </InfiniteScroll>
        );
    }
}

module.exports = connect(({feed_ids,feed_end,home_scroll})=>({
    feed_ids,
    feed_end,
}), null, null, {withRef: true})(Home);
