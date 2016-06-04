import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CommonCard from './components/CommonCard';
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
    current_myself_tab = (index) => {
        this.props.dispatch(createAction('current_myself_tab')(index));
        if (index == 1) {
            var url = '/api/clear_badge';
            fetch(url, {credentials:'same-origin'});
        }
    }
    render() {
        var { my_post_ids, notifications, posts, current_myself_tab, my_badge } = this.props;
        var my_posts = my_post_ids.map((id) => posts[id]);
        return (
            <div>
                <UserTopCard user={window.myself} />
                <div style={styles.d3}>
                    <div style={styles.d30} onClick={()=>this.current_myself_tab(0)}>
                        <div>分享动态</div>
                        { current_myself_tab == 0 && <div style={styles.d30u} /> }
                    </div>
                    <div style={styles.d30} onClick={()=>this.current_myself_tab(1)}>
                        <div>互动区{(my_badge > 0) && <span className="badge">{my_badge}</span>}</div>
                        { current_myself_tab == 1 && <div style={styles.d30u} /> }
                    </div>
                </div>
                { current_myself_tab == 0 && <FeedList posts={my_posts} /> }
                { current_myself_tab == 1 && notifications && notifications.map(
                    (n) => {
                        return <CommonCard
                            openid={n.openid2}
                            avatar={n.user.headimgurl}
                            txt={`${n.user.nickname} ${n.type=='like' ? '赞' : '订阅'}了你`}
                            pic_id={n.type == 'like' ? n.post.pic_id : null}
                        />;
                    }
                )}
            </div>
        );
    }
}

module.exports = connect(state=>({
    my_post_ids: state.my_post_ids,
    posts: state.posts,
    me_scroll: state.me_scroll,
    current_myself_tab: state.current_myself_tab,
    my_badge: state.my_badge,
    notifications: state.notifications
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
        position: 'relative',
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
