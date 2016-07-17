import React from 'react'
import update from '../../utility/update';

import qs from 'querystring';
import setShareInfo from '../../utility/set_share_info';
import CommentsInner from './CommentsInner';
import ListContainer from '../components/ListContainer';
import EmptyView from '../common/EmptyView';
import FollowLine from '../Detail/FollowLine';

import styles from './index.css'
import CSSModules from 'react-css-modules';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        window.setTitle('评论');
        setShareInfo();
    }
    componentDidUpdate() {
        setShareInfo();
    }
    load = ()=>{
        var { params } = this.props;
        return update('/api/update_post_detail?_id=' + params.id);
    }
    render() {
        var { post, user, post_detail, params } = this.props;
        return (
            <ListContainer id={`post_detail/${params.id}`} loadMore={this.load} hasMore={!post_detail}>
                <FollowLine />
                <CommentsInner
                    post={post}
                    user={user}
                    post_detail={post_detail}
                    emptyView={<EmptyView emptyText='还没有评论哦~'/>}
                />
            </ListContainer>
        );
    }
}

var get_users = state => state.users;
var get_post = (state, props) => state.posts[props.params.id];
var get_post_detail = (state, props) => state.post_details[props.params.id];
var get_user = createSelector(
    [get_post, get_users],
    (post, users) => post && users[post.user_id]
);
var mapStateToProps = createStructuredSelector({
    post: get_post,
    post_detail: get_post_detail,
    user: get_user
});
export default module.exports = connect(mapStateToProps)(
    CSSModules(Comments, styles)
);
