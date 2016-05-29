import React from 'react';
import { Link, hashHistory } from 'react-router';
import PostCard from './components/PostCard';
import FeedList from './components/FeedList';
import CssButton from './components/CssButton';
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
        var { user, posts } = this.state;
        return (
            <div>
                <div style={styles.d0}>
                    可以将好物清单分享给微信好友、朋友圈
                    <span style={styles.arrow}>
                        <CssButton className='image-icon_me_up' width={9} height={12}/>
                    </span>
                </div>
                <div style={styles.d1}>
                    <div style={styles.d11}></div>
                    <div style={styles.d12}>
                        <div>长按识别二维码，关注“物我”公众号</div>
                        <div>朋友互动不遗漏</div>
                    </div>
                </div>
                { user &&
                    <div style={styles.d2}>
                        <img src={user.headimgurl} style={styles.avatar}></img>
                        <div style={styles.n}>{user.nickname}</div>
                    </div>
                }
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
    d0: {
        height: 32,
        lineHeight: '32px',
        width: "100%",
        paddingLeft: 20,
        fontSize: 12,
        color: '#ffffff',
        backgroundColor: '#6699cc'
    },
    arrow: {
        float: 'right',
        marginRight: 20
    },
    d1: {
        height: 48,
        width: "100%",
        paddingLeft: 20,
        backgroundColor: '#81d9d0',
        display: 'table'
    },
    d2: {
        align: 'center',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 24,
        width: '100%'
    },
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
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    n: {
        marginTop: 20,
        fontSize: 17,
        color: '#000000'
    },
    d11: {
        display: 'table-cell'
    },
    d12: {
        display: 'table-cell',
        height: 48,
        verticalAlign: 'middle',
        lineHeight: 1,
        fontSize: 14,
        color: '#ffffff',
    }
};
