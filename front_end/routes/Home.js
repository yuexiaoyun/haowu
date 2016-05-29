import React from 'react';
import { Link, hashHistory } from 'react-router';
import PostCard from './components/PostCard';
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
        var url = '/api/fetch_posts';
        showProgress('加载中', fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(data => {
                this.setState({posts: data.posts});
                return null;
            }).catch(PopupHelper.toast));
    }
    render() {
        return (
            <div style={styles.d1}>
                <div style={styles.d2()}>{
                    this.state.posts && this.state.posts.map((post, i) => {
                        if (i % 2 == 0) {
                            return <PostCard user={post.user} post={post} />;
                        } else {
                            return null;
                        }
                    })
                }</div>
                <div style={styles.d2()}>{
                    this.state.posts && this.state.posts.map((post, i) => {
                        if (i % 2 == 1) {
                            return <PostCard user={post.user} post={post} />;
                        } else {
                            return null;
                        }
                    })
                }</div>
            </div>
        );
    }
}
var styles = {
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
