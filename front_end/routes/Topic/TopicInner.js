import React from 'react';
import { findDOMNode } from 'react-dom';
import fconf from '../../fconf';
import moment from 'moment'
import _ from 'underscore';

import PicDetail from '../Post/PicDetail'
import AuthorLine from '../Post/AuthorLine'

import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { createSelector, createStructuredSelector } from 'reselect';
import styles from './TopicInner.css'
import CSSModules from 'react-css-modules'

class PostSmallCard extends React.Component {
    componentDidMount() {
        if (this.props.active)
            this.handleActive();
    }
    componentDidUpdate(prevProps) {
        var { active } = this.props;
        if (!prevProps.active && active)
            this.handleActive();
    }
    handleActive = () => {
        findDOMNode(this).scrollIntoViewIfNeeded(false);
    }
    render() {
        var { post, active, playing, onClick } = this.props;
        return (
            <div styleName='icon-container' onClick={onClick}>
                <img
                    styleName='icon'
                    src={fconf.qiniu.site + post.pic_id + '-b80'}
                    />
                { active && <div styleName={ playing ? 'icon-div-playing' : 'icon-div-paused'} /> }
            </div>
        );
    }
}

PostSmallCard = CSSModules(PostSmallCard, styles)

class Topic extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        var playlist = this.props.post_list.map((post) => {
            return {
                audio_id: post.audio_id,
                post_id: post._id,
                user_id: post.user_id
            }
        });
        this.props.dispatch(createAction('set_playlist')(playlist));
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('set_playlist')(null));
    }
    componentDidUpdate(prevProps) {
        var { audio_player, post_list } = this.props;
        if (audio_player.id != prevProps.audio_player.id) {
            for (var i in post_list) {
                var post = post_list[i];
                if (post.audio_id == audio_player.id)
                    this.props.select(i);
            }
        }
    }
    onIconClick = (i, post) => {
        var { index, post_list, audio_player, dispatch } = this.props;
        if (i == index && audio_player.id == post.audio_id) {
            dispatch(createAction('stop')(post.audio_id));
        } else {
            var post = post_list[i];
            dispatch(createAction('play')({
                audio_id: post.audio_id,
                post_id: post._id,
                user_id: post.user_id
            }));
        }
    }
    render() {
        var { post, post_list, user, title, index, total_length, current_length, audio_player } = this.props;
        var progress = (current_length * 100 / total_length).toFixed(2);
        var current = moment(current_length + 500).format('mm:ss') + ' ' + title;
        var total = moment(total_length + 500).format('mm:ss');
        return (
            <div>
                <PicDetail post={post} user={user}>
                    <div styleName='progress-container'>
                        <div styleName='progress' style={{width: `${progress}%`}} />
                        <div styleName='number-container'>
                            <div styleName='current'>{ current }</div>
                            <div styleName='total'>{ total }</div>
                        </div>
                    </div>
                </PicDetail>
                <div styleName='icon-list-container'>
                    <div styleName='triangle-left' />
                    <div styleName='triangle-right' />
                    <div styleName='icon-list'>
                        { post_list.map((post, i)=>(<PostSmallCard
                            post={post}
                            active={index == i}
                            onClick={()=>this.onIconClick(i, post)}
                            playing={audio_player.id == post.audio_id}
                        />)) }
                    </div>
                </div>
                <AuthorLine post={post} user={user} />
            </div>
        )
    }
}

var get_post_list = (state, props) => props.post_ids.map(id=>state.posts[id]);
var get_index = (state, props) => props.index;
var get_post = createSelector(
    [get_post_list, get_index],
    (post_list, index) => post_list[index]
);
var get_total_length = createSelector(
    [get_post_list],
    (post_list) => _.reduce(post_list, (mem, post)=>{
        return (parseInt(post.length) || 0) + mem;
    }, 0)
);
var get_audio_player = state=>state.audio_player;
var get_current_length = createSelector(
    [get_post_list, get_post, get_index, get_audio_player],
    (post_list, post, index, audio_player) => {
        var past_length = _.reduce(_.first(post_list, index), (mem, post)=>{
            return (parseInt(post.length) || 0) + mem;
        }, 0);
        if (audio_player.id == post.audio_id) {
            var time = audio_player.time;
            if (time > post.length)
                time = post.length;
            if (time)
                past_length += time;
        }
        return past_length;
    }
);
var get_users = state=>state.users;
var get_user = createSelector(
    [get_post, get_users],
    (post, users) => post && users[post.user_id]
)
var mapStateToProps = createStructuredSelector({
    post_list: get_post_list,
    post: get_post,
    user: get_user,
    total_length: get_total_length,
    current_length: get_current_length,
    audio_player: get_audio_player
})

export default connect(mapStateToProps)(
    CSSModules(Topic, styles)
);
