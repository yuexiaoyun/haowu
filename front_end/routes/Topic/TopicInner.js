import React from 'react';
import { findDOMNode } from 'react-dom';
import fconf from '../../fconf';
import moment from 'moment'
import _ from 'underscore';

import PicDetail from '../Post/PicDetail'
import AuthorLine from '../Post/AuthorLine'
import { play } from '../../utility/audio_manager';

import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { createSelector, createStructuredSelector } from 'reselect';
import styles from './TopicInner.css'
import CSSModules from 'react-css-modules'

class PostSmallCard extends React.Component {
    componentDidUpdate(prevProps) {
        if (!prevProps.active && this.props.active)
            findDOMNode(this).scrollIntoViewIfNeeded(false);
    }
    render() {
        var { post, active, onClick } = this.props;
        return (
            <div styleName='icon-container' onClick={onClick}>
                <img
                    styleName='icon'
                    src={fconf.qiniu.site + post.pic_id + '-b80'}
                    />
                { active && <div styleName='icon-div' /> }
            </div>
        );
    }
}

PostSmallCard = CSSModules(PostSmallCard, styles)

class Topic extends React.Component {
    componentDidMount() {
        this.play();
    }
    componentDidUpdate(prevProps) {
        var { index, current_length, post_list } = this.props;
        if (prevProps.index != index) {
            this.play();
        } else if (prevProps.current_length > current_length) {
            index = index + 1;
            if (index < post_list.length)
                this.props.select(index);
            else
                this.props.select(0);
        }
    }
    play = () => {
        var { post } = this.props;
        play(post.audio_id, post._id, post.user_id);
    }
    render() {
        var { post, post_list, user, index, total_length, current_length, select } = this.props;
        var progress = (current_length * 100 / total_length).toFixed(2);
        var current = moment(current_length + 500).format('mm:ss');
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
                            onClick={()=>select(i)}
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
