import React from 'react'
import Helmet from 'react-helmet'
import PostCard from './components/PostCard'
import screenSize from '../utility/screen_size';
import update from '../utility/update';
import CssButton from './components/CssButton';
import Loader from './components/Loader';
import fconf from '../fconf';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions'
import { fromObjectId } from '../utility/format_time';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import _ from 'underscore';
import qs from 'querystring';

class Post extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    preview = () => {
        var { post } = this.props;
        wx.previewImage({
            current: fconf.qiniu.site + post.pic_id,
            urls: [fconf.qiniu.site + post.pic_id]
        });
    }
    like = () => {
        var { post, dispatch } = this.props;
        dispatch(createAction('like')(post._id));
        var url = '/api/like?' + qs.stringify({
            _id: post._id
        });
        fetch(url, {credentials: 'same-origin'});
    }
    deletePost = () => {
        if (confirm('您确认要删除么？')) {
            var { post } = this.props;
            var url = '/api/delete_post?' + qs.stringify({
                _id: post._id
            });
            update(url)
                .then(()=>{
                    PopupHelper.toast('删除成功');
                    hashHistory.go(-1);
                })
                .catch((err)=>{
                    alert(err);
                    PopupHelper.toast('删除失败');
                });
        }
    }
    gotoDetail = () => {
        var { user } = this.props;
        hashHistory.push('detail/' + user.openid);
    }
    componentDidMount() {
        var { params } = this.props;
        update('/api/update_post_detail?_id=' + params.id);
    }
    render() {
        var { post, user, like_users } = this.props;
        var { err } = this.state;
        var d = post && Math.floor((post.length + 500) / 1000) || 0;
        return (
            <div>
                <Helmet title={'发布详情'} />
                { user && <div style={styles.d} onClick={this.gotoDetail}>
                    <img src={user.headimgurl} width="34" height="34" style={styles.avatar}/>
                    <div>
                        <div style={styles.name}><strong>{user.nickname}</strong></div>
                        <div style={styles.time}>{ fromObjectId(post._id) }</div>
                    </div>
                </div> }
                { post && <div className="card-content image-icon_image_loading"
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
                </div> }
                { post && <div style={styles.d1}>
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
                        <span style={styles.reads}>{`${post.read_count}人听过`}</span>
                    </div>
                </div> }
                { !like_users && !err && <Loader /> }
                { post && like_users && <div style={styles.dd}>
                    <div style={styles.praise}>
                        <CssButton
                            className={"image-btn_detail_praise" +(post.me_like ? "_selected" : "")}
                            onClick={this.like}
                            width={40}
                            height={32}/>
                    </div>
                    { like_users.map(user => (<img
                        src={user.headimgurl}
                        onClick={()=>hashHistory.push('detail/' + user.openid)}
                        style={styles.like_user} />)) }
                    { post.openid == window.openid && <div style={styles.delete} onClick={this.deletePost}>
                        <CssButton
                            className={"image-btn_detail_delete"}
                            onClick={this.delete}
                            width={40}
                            height={32}/>
                    </div> }
                </div> }
            </div>
        )
    }
}

export default connect((state, props) => {
    var post = state.posts[props.params.id];
    var user = post && state.users[post.openid];
    var post_detail = state.post_details[props.params.id];
    var like_users = (()=> {
        if (post && post_detail && post_detail.likes) {
            var likes = _.filter(post_detail.likes, id=>(id!=window.openid));
            if (post.me_like)
                likes = [window.openid, ...likes];
            return likes.map(id=>state.users[id]);
        }
        return null;
    })();
    return {
        post, user, like_users
    }
})(Post);

var styles = {
    d: {
        width: '100%',
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    dd: {
        borderTop: '1px solid #dfdfdd',
        paddingTop: 4,
        marginTop: 20,
        height: 32
    },
    praise: {
        float: 'left',
        height: 32,
        width: 48,
        paddingTop: 3,
        marginBottom: 0,
        marginLeft: 15,
        paddingRight: 8
    },
    like_user: {
        width: 30,
        height: 30,
        overflow: 'hidden',
        borderRadius: '50%',
        marginLeft: 10
    },
    delete: {
        float: 'right',
        height: 32,
        width: 40,
        paddingTop: 3,
        marginRight: 15,
        marginBottom: 0
    },
    avatar: {
        float: 'left',
        width: 30,
        height: 30,
        overflow: 'hidden',
        borderRadius: '50%',
        marginRight: 10
    },
    name: {
        align: 'left',
        textAlign: 'left',
        fontSize: 15,
        lineHeight: '15px',
        marginBottom: 2
    },
    time: {
        textAlign: 'left',
        fontSize: 12,
        lineHeight: '12px',
        color: '#999999'
    },
    d1: {
        display: 'table',
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
