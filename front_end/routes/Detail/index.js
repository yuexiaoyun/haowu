import React from 'react';
import { hashHistory } from 'react-router';
import update from '../../utility/update';
import setShareInfo from '../../utility/set_share_info';
import fconf from '../../fconf';

import UserTop from './UserTop';
import EmptyView from './EmptyView';
import FeedList from '../components/FeedList';
import Loader from '../components/Loader';

import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

class Detail extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var { user } = this.props;
        var url = '/api/update_user_detail?_id=' + id;
        update(url)
            .catch((err) => this.setState({err}));
        if (user) {
            window.setTitle(user.nickname + '的主页');
            this.setShareInfo();
        }
    }
    componentDidUpdate() {
        var { user } = this.props;
        if (user) {
            window.setTitle(user.nickname + '的主页');
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
            title,
            desc: '物记，好物有声',
            link: fconf.site + '/app/detail/' + user._id,
            imgUrl: user.headimgurl
        });
    }
    handleHeight = (height) => {
        console.log('height: ' + height);
        this.setState({topHeight: height});
    }
    render() {
        var { user, post_ids } = this.props;
        var { err } = this.state;
        var ta = user && user._id == window.user_id && '我' || 'Ta';
        return (
            <div>
                { user && <UserTop user={user} handleHeight={this.handleHeight}/> }
                { !post_ids && !err && <Loader /> }
                { post_ids && post_ids.length > 0 && <FeedList ids={post_ids} /> }
                { post_ids && post_ids.length == 0 && this.state.topHeight &&
                    <EmptyView topHeight={this.state.topHeight} emptyText={`${ta}还没有发布过好物`}/>}
            </div>
        )
    }
}

var get_user = (state, props) => state.users[props.params.id];
var get_post_ids = (state, props) => state.user_post_ids[props.params.id];

var mapStateToProps = createStructuredSelector({
    user: get_user,
    post_ids: get_post_ids
});

export default connect(mapStateToProps)(
    Detail
);
