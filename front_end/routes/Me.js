import React from 'react';
import { Link, hashHistory } from 'react-router';
import FeedList from './components/FeedList';
import UserTopCard from './components/UserTopCard';
import CssButton from './components/CssButton';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';

export default class Me extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var url = '/api/fetch_me';
        showProgress('加载中', fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(data => {
                this.setState({posts: data.posts, user: data.user});
                return null;
            }).catch(PopupHelper.toast));
    }
    render() {
        var { user, posts } = this.state;
        return (
            <div className='content'>
                { user && <UserTopCard user={user} /> }
                <div style={styles.d3}>
                    <div style={styles.d30}>
                        <div>分享动态</div>
                        <div style={styles.d30u} />
                    </div>
                    <div style={styles.d30}>
                        <div>互动区</div>
                    </div>
                </div>
                <FeedList posts={posts} />
            </div>
        );
    }
}

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
