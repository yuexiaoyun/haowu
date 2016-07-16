import React from 'react';
import { findDOMNode } from 'react-dom';

import Feed from './Feed';

import PostCard from './PostCard';

import { createSelector, createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';

class FeedList extends React.Component {
    static propTypes = {
        post_list: React.PropTypes.array.isRequired,
        users: React.PropTypes.object.isRequired,
        showUser: React.PropTypes.bool.isRequired,
        PostCardChild: React.PropTypes.func,
        renderTopItem: React.PropTypes.func,
        getTopItemHeight: React.PropTypes.func
    }
    renderItem = (i, w) => {
        var { post_list, users, showUser, PostCardChild, renderTopItem } = this.props;
        if (renderTopItem) {
            if (i == 0) {
                return renderTopItem();
            } else {
                i = i - 1;
            }
        }
        var post = post_list[i];
        var user = showUser && users[post.user_id] || null;
        return (
            <PostCard key={post._id} w={w} post={post} user={user}>
                { PostCardChild && <PostCardChild post={post} /> }
            </PostCard>
        );
    }
    getItemHeight = (i, w) => {
        var { post_list, showUser, renderTopItem, getTopItemHeight } = this.props;
        if (renderTopItem) {
            if (i == 0) {
                return getTopItemHeight();
            } else {
                i = i - 1;
            }
        }
        var post = post_list[i];
        return 86 + post.h * w / post.w
    }
    getItemCount = () => {
        var { post_list, renderTopItem } = this.props;
        return (post_list && post_list.length || 0) + (renderTopItem ? 1: 0);
    }
    render() {
        return (
            <Feed
                count={this.getItemCount()}
                renderItem={this.renderItem}
                getItemHeight={this.getItemHeight} />
        );
    }
}

var get_users = state => state.users;
var mapStateToProps = createStructuredSelector({
    users: get_users
})
export default connect(mapStateToProps)(FeedList);
