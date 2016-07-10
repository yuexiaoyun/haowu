import React from 'react'
import update from '../../utility/update';

import qs from 'querystring';
import classNames from 'classnames';
import setShareInfo from '../../utility/set_share_info';
import _ from 'underscore';
import fconf from '../../fconf';
import * as actions from '../../actions'

import TopCard from './TopCard';
import CommentsInner from '../Comments/CommentsInner';

import styles from './index.css'
import CSSModules from 'react-css-modules';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        var { params } = this.props;
        update('/api/update_post_detail?_id=' + params.id);
        window.setTitle('详情');
        this.setShareInfo();
    }
    componentDidUpdate() {
        this.setShareInfo();
    }
    setShareInfo = () => {
        var { post, user } = this.props;
        if (post && user) {
            var link = fconf.site + '/app/post/' + post._id;
            var title = post.title || '分享了一件好物';
            setShareInfo({
                title: title + ` | ${user.nickname}的物记`,
                link,
                imgUrl: fconf.qiniu.site + post.pic_id + '-b80'
            });
        }
    }
    startEditTitle = () => {
        if (this.props.post.user_id == window.user_id)
            this.setState({edit_title: 1})
    }
    handleEditTitle = (title) => {
        var { post, dispatch } = this.props;
        setTimeout(()=>{
            dispatch(actions.set_title({
                _id: post._id,
                title
            }));
            this.setState({edit_title: 0})
        }, 0);
    }
    render() {
        var { post, user, users, post_detail, location: {query} } = this.props;
        var { record, err, edit_title } = this.state;
        return (
            <div styleName='root'>
                { post && <TopCard
                    post={post}
                    user={user}
                    edit_title={edit_title}
                    startEditTitle={this.startEditTitle}
                    handleEditTitle={this.handleEditTitle}/> }
                <CommentsInner
                    post={post}
                    user={user}
                    post_detail={post_detail}
                    edit_title={edit_title}
                    new_id={query && (query.reply_id || query.comment_id)}
                    reply_comment_id={query && query.comment_id}
                    reply_user_id={query && query.user_id}
                    />
            </div>
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
    CSSModules(Post, styles)
);
