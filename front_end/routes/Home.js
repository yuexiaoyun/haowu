import React from 'react';
import { Link, hashHistory } from 'react-router';
import PostCard from './components/PostCard';
import { parse_online_json } from '../utility/fetch_utils';

export default class Me extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        var id = this.props.params.id;
        var url = '/api/fetch_posts';
        fetch(url, {credentials:'same-origin'})
            .then(parse_online_json)
            .then(data => {
                this.setState({posts: data.posts});
            }).catch(alert);
    }
    render() {
        return (
            <div>{
                this.state.posts && this.state.posts.map(post => {
                    return <PostCard user={post.user} post={post} />;
                })
            }</div>
        );
    }
}
