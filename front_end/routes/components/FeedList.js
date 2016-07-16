import React from 'react';
import { findDOMNode } from 'react-dom';

import Feed from './Feed';

import PostCard from './PostCard';

import { createSelector, createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';

class FeedList extends React.Component {
    renderItem = (i, w) => {
        var { post_list, users, showUser, PostCardChild } = this.props;
        var post = post_list[i];
        var user = showUser && users[post.user_id] || null;
        return (
            <PostCard key={post._id} w={w} post={post} user={user}>
                { PostCardChild && <PostCardChild post={post} /> }
            </PostCard>
        );
    }
    getItemHeight = (i, w) => {
        var { post_list, showUser } = this.props;
        var post = post_list[i];
        return 86 + post.h * w / post.w
    }
    render() {
        var { post_list } = this.props;
        return (
            <Feed
                count={post_list && post_list.length || 0}
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
