import React from 'react';
import qs from 'querystring';
import { parse_online_json } from '../utility/fetch_utils';
import { hashHistory } from 'react-router';
import PostCard from './components/PostCard';

export default class Pub extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var url = '/api/fetch_post?_id=' + id;
        fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(data => {
                this.setState({user: data.user, post: data.post});
                /*
                wx.ready(() => {
                    wx.onMenuShareAppMessage({
                        title: data.user.nickname + '分享的私物',
                        desc: '某产品经理的设计里面既没有标题也没有描述',
                        link: 'http://haowu.tunnel.qydev.com/app/post/' + data.post._id
                    });
                });
                */
            }).catch(alert);
    }
    render() {
        var { post, user } = this.state;
        return post && <PostCard post={post} user={user}/> || <div />;
    }
}
