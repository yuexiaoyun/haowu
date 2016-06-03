import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CssButton from './components/CssButton';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

class Me extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        if (!this.props.myself) {
            var url = '/api/fetch_me';
            showProgress('加载中', fetch(url, {credentials:'same-origin'})
                .then(parse_online_json)
                .then(createAction('myself'))
                .then(this.props.dispatch)
                .catch(PopupHelper.toast));
        }
        if (this.props.me_scroll)
            window.scrollTop = this.props.me_scroll;
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('me_scroll')(window.scrollTop));
    }
    render() {
        var { myself, my_post_ids, posts } = this.props;
        var my_posts = my_post_ids.map((id) => posts[id]);
        return (
            <div>
                { myself && <UserTopCard user={myself} /> }
                <div style={styles.d3}>
                    <div style={styles.d30}>
                        <div>分享动态</div>
                        <div style={styles.d30u} />
                    </div>
                    <div style={styles.d30}>
                        <div>互动区</div>
                    </div>
                </div>
                <FeedList posts={my_posts} />
            </div>
        );
    }
}

module.exports = connect(state=>({
    myself: state.myself,
    my_post_ids: state.my_post_ids,
    posts: state.posts,
    me_scroll: state.me_scroll
}))(Me);

var styles = {
    d3: {
        display: 'table',
        width: '100%',
        height: 44,
        tableLayout: 'fixed',
        borderTop: '1px solid rgba(0, 0, 0, 0.15)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
    },
    d30: {
        display: 'table-cell',
        paddingTop: 12,
        textAlign: 'center',
        color: '#666666',
        fontSize: 14
    },
    d30u: {
        margin: '0px auto',
        backgroundColor: '#666666',
        width: 60,
        height: 2
    }
};
