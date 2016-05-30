import React from 'react';
import FeedList from './components/FeedList';
import { parse_online_json } from '../utility/fetch_utils';
import PopupHelper from '../utility/PopupHelper';
import showProgress from '../utility/show_progress';
import screenSize from '../utility/screen_size';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

class Home extends React.Component {
    componentDidMount() {
        if (!this.props.feed_posts) {
            var id = this.props.params.id;
            var url = '/api/fetch_posts';
            showProgress('加载中', fetch(url, {credentials:'same-origin'})
                .then(parse_online_json)
                .then(data => {
                    try {
                        this.props.dispatch(createAction('feed_posts')(data.posts));
                        return null;
                    } catch(err) {
                        alert(err);
                    }
                }).catch(PopupHelper.toast));
        }
        if (this.props.home_scroll)
            this.refs.content.scrollTop = this.props.home_scroll;
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('home_scroll')(this.refs.content.scrollTop));
    }
    render() {
        return (
            <div className='content' ref='content'>
                { this.props.feed_posts && <FeedList posts={this.props.feed_posts} /> }
            </div>
        );
    }
}

module.exports = connect(state=>({
    feed_posts: state.feed_posts,
    home_scroll: state.home_scroll
}))(Home);
