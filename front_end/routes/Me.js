import React from 'react';
import { Link, hashHistory } from 'react-router';
import PostCard from './components/PostCard';
import FeedList from './components/FeedList';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';
import screenSize from '../utility/screen_size';

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
        return (
            <div>
                <div style={styles.dd0}>可以将好物清单分享给微信好友、朋友圈</div>
                <div style={styles.dd1}>
                    <div style={styles.dd11}></div>
                    <div style={styles.dd12}>
                        <div>长按识别二维码，关注“物我”公众号</div>
                        <div>朋友互动不遗漏</div>
                    </div>
                </div>
                <FeedList posts={this.state.posts} />
            </div>
        );
    }
}
var styles = {
    dd0: {
        height: 32,
        lineHeight: '32px',
        width: "100%",
        paddingLeft: 20,
        fontSize: 12,
        color: '#ffffff',
        backgroundColor: '#6699cc'
    },
    dd1: {
        height: 48,
        width: "100%",
        paddingLeft: 20,
        fontSize: 14,
        color: '#ffffff',
        backgroundColor: '#81d9d0',
        display: 'table'
    },
    d1: {
        width: '100%',
        paddingLeft: 3,
        paddingRight: 3
    },
    d2: () => {
        return {
            width: (screenSize().width - 6) / 2,
            float: 'left'
        }
    }
}
