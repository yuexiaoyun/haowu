import React from 'react';
import { hashHistory } from 'react-router';
import update from '../../utility/update';
import setShareInfo from '../../utility/set_share_info';
import fconf from '../../fconf';

import UserTop from './UserTop';
import EmptyView from '../common/EmptyView';
import FeedList from '../components/FeedList';
import TopicCard from './TopicCard';
import ListContainer from '../components/ListContainer';

import emptyImage from '../../files/image_zhuanji_404.png'

import { createAction } from 'redux-actions'
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import styles from './index.css'
import CSSModules from 'react-css-modules';

class Detail extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        this.setTitleAndShareInfo();
    }
    componentDidUpdate() {
        this.setTitleAndShareInfo();
    }
    setTitleAndShareInfo = () => {
        var { user } = this.props;
        if (user) {
            window.setTitle(user.nickname + '的物记');
            this.setShareInfo();
        }
    }
    setShareInfo = () => {
        var { user } = this.props;
        var title = user.nickname + '的好物记录';
        if (user.post_count > 0) {
            title = `${user.nickname}的${user.post_count}条好物记录`;
            if (user.reads_count > 10)
                title += `，已获${user.reads_count}次收听`;
        }
        console.log(title);
        setShareInfo({
            title: `${title} | 物记，好物有声`,
            link: fconf.site + '/app/detail/' + user._id,
            imgUrl: user.headimgurl
        });
    }
    handleHeight = (height) => {
        if (this.state.topHeight != height)
            this.setState({topHeight: height});
    }
    load = () => {
        var id = this.props.params.id;
        var url = '/api/update_user_detail?_id=' + id;
        return update(url);
    }
    renderPostList() {
        var { user, post_list } = this.props;
        var ta = user && user._id == window.user_id && '我' || 'Ta';
        return post_list.length > 0
            && <FeedList post_list={post_list} />
            || <EmptyView topHeight={this.state.topHeight} emptyText={`${ta}还没有发布过好物`}/>
    }
    renderTopicList() {
        var { user, topic_list } = this.props;
        var ta = user && user._id == window.user_id && '我' || 'Ta';
        var me = user && user._id == window.user_id;
        console.log(topic_list);
        return (
            <div>
                { me && <div styleName='pub-topic-container' onClick={()=>hashHistory.push('/pub_topic')}>
                    <div styleName='pub-topic'>新建专辑</div>
                </div> }
                { topic_list.length > 0
                    ? topic_list.map(topic=><TopicCard key={topic._id} topic={topic} />)
                    : <EmptyView
                    topHeight={this.state.topHeight + (me ? 34 : 0)}
                    emptyText={`${ta}还没有发布过专辑`}
                    emptyImage={emptyImage}
                    /> }
            </div>
        );
    }
    render() {
        var { user, post_list, topic_list, current_tab, location, dispatch } = this.props;
        var fullfilled = !!(user && post_list && topic_list);
        return (
            <ListContainer id={location.key} hasMore={!fullfilled} loadMore={this.load}>
                { user && <UserTop
                    user={user}
                    handleHeight={this.handleHeight}
                    currentTab={current_tab}
                    setCurrentTab={(current_tab)=>{
                        dispatch(createAction('set_route_state')({
                            key: location.key,
                            value: {
                                current_tab
                            }
                        }));
                    }}
                    /> }
                { current_tab == 0 && user && post_list && this.renderPostList() }
                { current_tab == 1 && user && topic_list && this.renderTopicList() }
            </ListContainer>
        );
    }
}

var get_posts = state => state.posts;
var get_user = (state, props) => state.users[props.params.id];
var get_post_ids = (state, props) => state.user_post_ids[props.params.id];
var get_post_list = createSelector(
    [get_post_ids, get_posts],
    (post_ids, posts) => post_ids && post_ids.map(id=>posts[id]) || null
);
var get_topics = state => state.topics;
var get_topic_ids = (state, props) => state.user_topic_ids[props.params.id];
var get_topic_list = createSelector(
    [get_topic_ids, get_topics],
    (topic_ids, topics) => topic_ids && topic_ids.map(id=>topics[id]) || null
);
var get_current_tab = (state, props) => {
    var key = props.location.key;
    var value = state.route_state[key];
    return value ? value.current_tab : 0;
};

var mapStateToProps = createStructuredSelector({
    user: get_user,
    post_list: get_post_list,
    topic_list: get_topic_list,
    current_tab: get_current_tab
});

export default module.exports = connect(mapStateToProps)(
    CSSModules(Detail, styles)
);
