import React from 'react';
import { findDOMNode } from 'react-dom';
import PostCard from './PostCard';

import { createSelector, createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';

class __FeedList extends React.Component {
    renderPost = post => {
        var { users, showUser, w, PostCardChild } = this.props;
        return (
            <PostCard key={post._id} w={w} post={post} user={showUser && users[post.user_id] || null}>
                { PostCardChild && <PostCardChild post={post} /> }
            </PostCard>
        );
    }
    render() {
        var {post_div_list, w, users, showUser} = this.props;
        var styles = {
            d1: {
                width: '100%',
                paddingLeft: 3,
                paddingRight: 3
            },
            d2: () => {
                return {
                    width: w,
                    float: 'left'
                }
            }
        }
        return (
            <div style={styles.d1}>
                <div style={styles.d2()} key={'list0'}>
                    { post_div_list[0].map(this.renderPost)}
                </div>
                <div style={styles.d2()} key={'list1'}>
                    { post_div_list[1].map(this.renderPost)}
                </div>
                <div style={{width: '100%', height: 0, clear:'both', overflow:'hidden'}} />
            </div>
        );
    }
}

var get_post_div_list = (state, props) => {
    var { w, post_list } = props;
    var hs = [0, 0];
    var post_div_list = [[], []];
    (post_list || []).map(post => {
        var h = 86 + post.h * w / post.w;
        if (hs[0] <= hs[1]) {
            post_div_list[0].push(post);
            hs[0] += h;
        } else {
            post_div_list[1].push(post);
            hs[1] += h;
        }
    });
    return post_div_list;
}

var get_users = state => state.users;
var mapStateToProps = createStructuredSelector({
    post_div_list: get_post_div_list,
    users: get_users
})
var _FeedList = connect(mapStateToProps)(__FeedList);

export default class FeedList extends React.Component {
    constructor() {
        super();
        this.state = { width: window.innerWidth };
    }
    componentDidMount() {
        this.setSize();
        window.addEventListener('resize', this.setSize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.setSize);
    }
    setSize = () => {
        var dom = findDOMNode(this);
        this.setState({width: dom.clientWidth});
    }
    render() {
        var {width} = this.state;
        var w = (width - 6) / 2;
        return <_FeedList {...this.props} w={w} />;
    }
}
