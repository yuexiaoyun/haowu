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
        var url = '/api/fetch_posts';
        showProgress('加载中', fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(data => {
                this.setState({posts: data.posts});
                return null;
            }).catch(PopupHelper.toast));
    }
    render() {
        return this.state.posts && <FeedList posts={this.state.posts} /> || <div></div>;
    }
}
