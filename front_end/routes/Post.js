import React from 'react'
import Helmet from 'react-helmet'
import PostCard from './components/PostCard'
import screenSize from '../utility/screen_size';
import CssButton from './components/CssButton';
import Loader from './components/Loader';
import fconf from '../fconf';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { fromObjectId } from '../utility/format_time';
import { parse_online_json } from '../utility/fetch_utils';

class Post extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    preview = () => {
        var { posts, params } = this.props;
        var post = posts[params.id];
        wx.previewImage({
            current: fconf.qiniu.site + post.pic_id,
            urls: [fconf.qiniu.site + post.pic_id]
        });
    }
    gotoDetail = () => {
        var { posts, users, params } = this.props;
        var post = posts[params.id];
        var user = users[post.openid];
        hashHistory.push('detail/' + user.openid);
    }
    componentDidMount() {
        var { params } = this.props;
        fetch('/api/fetch_post_detail?_id=' + params.id, { credentials: 'same-origin'})
            .then(parse_online_json)
            .then((data) => this.setState(data))
            .catch((err) => this.setState({err}));
    }
    render() {
        var { posts, users, params } = this.props;
        var { like_users, err } = this.state;
        var post = posts[params.id];
        var user = users[post.openid];
        var d = Math.floor((post.length + 500) / 1000);
        return (
            <div>
                <Helmet title={'发布详情'} />
                <div style={styles.d} onClick={this.gotoDetail}>
                    <img src={user.headimgurl} width="34" height="34" style={styles.avatar}/>
                    <div>
                        <div style={styles.name}><strong>{user.nickname}</strong></div>
                        <div style={styles.time}>{ fromObjectId(post._id) }</div>
                    </div>
                </div>
                <div className="card-content image-icon_image_loading"
                    style={{
                        height: screenSize().width,
                        backgroundColor: '#f8f8f8',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '24px 24px',
                        position: 'relative'
                    }}>
                    <img src={fconf.qiniu.site + post.pic_id }
                        className="bgTranslate2"
                        onClick={this.preview}/>
                </div>
                <div style={styles.d1}>
                    <div style={styles.d2}>
                        { d + '"' }
                    </div>
                    <div style={styles.d2}>
                        <CssButton
                        className='image-btn_play_start'
                        width={60}
                        height={60}/>
                    </div>
                    <div style={styles.d2}>
                        <span style={styles.reads}>{`${(post.reads ? post.reads.length : 0)}人听过`}</span>
                    </div>
                </div>
                { !like_users && !err && <Loader /> }
                { like_users && <div style={styles.dd}><div style={styles.praise}>
                        <CssButton
                            className={"image-btn_praise_selected"}
                            onClick={this.like}
                            width={20}
                            height={20}/>
                    </div>
                    { like_users.map(user => (<img src={user.headimgurl} style={styles.like_user} />)) }
                </div> }
            </div>
        )
    }
}

export default connect(({posts, users}) => ({posts, users}))(Post);

var styles = {
    d: {
        width: '100%',
        paddingLeft: 12,
        paddingTop: 8,
        paddingBottom: 12,
    },
    dd: {
        marginTop: 20,
        height: 30
    },
    praise: {
        float: 'left',
        marginLeft: 15,
        paddingTop: 4,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#cccccc',
        marginRight: 8,
        marginTop: 0,
    },
    avatar: {
        float: 'left',
        width: 34,
        height: 34,
        overflow: 'hidden',
        borderRadius: '50%',
        marginRight: 5
    },
    like_user: {
        width: 30,
        height: 30,
        overflow: 'hidden',
        borderRadius: '50%',
        marginLeft: 10
    },
    name: {
        align: 'left',
        textAlign: 'left',
        lineHeight: '20px',
        fontSize: 12
    },
    time: {
        textAlign: 'left',
        lineHeight: '14px',
        fontSize: 10
    },
    d1: {
        display: 'table',
        marginBottom: 5,
        tableLayout: 'fixed',
        width: '100%',
        height: 64,
        marginTop: 20
    },
    d2: {
        display: 'table-cell',
        textAlign: 'center',
        align: 'center',
        width: '100%',
        verticalAlign: 'middle'
    },
    reads: {
        display: 'inline-block',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 12,
        height: 24,
        fontSize: 12,
        lineHeight: '24px',
        border: '1px solid rgba(0, 0, 0, 0.15)',
    }
}
