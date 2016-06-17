import React from 'react';
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CssButton from './components/CssButton';
import { parse_online_json } from '../utility/fetch_utils';
import update from '../utility/update';
import Loader from './components/Loader';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

class Detail extends React.Component {
    constructor() {
        super();
        this.state = {ids: []};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var user = this.props.users[id];
        var url = (id == window.user_id) ? '/api/update_me' : '/api/update_user_detail?_id=' + id;
        update(url)
            .catch((err) => this.setState({err}));
        window.setTitle(user.nickname + '的主页');
    }
    render() {
        var id = this.props.params.id;
        var { posts, users, user_post_ids } = this.props;
        var { err } = this.state;
        var user = users[id];
        var ids = user_post_ids[id];
        return (
            <div className='absolute'>
                <UserTopCard user={user} />
                <div style={styles.d3} />
                { !ids && !err && <Loader /> }
                { ids && ids.length > 0 && <FeedList ids={ids} /> }
                { ids && ids.length == 0 && (
                    <div className='empty'>
                        <div className='empty-view image-image_404'>Ta还没有发布任何一件好物</div>
                    </div>
                )}
            </div>
        );
    }
}

module.exports = connect(({posts, users, user_post_ids}) => ({posts, users, user_post_ids}))(Detail);

var styles = {
    d3: {
        width: '100%',
        height: 1,
        borderBottom: '1px solid #dfdfdd'
    }
};
