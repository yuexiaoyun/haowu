import React from 'react';
import { findDOMNode } from 'react-dom';
import fconf from '../../fconf';
import moment from 'moment'
import _ from 'underscore';
import setShareInfo from '../../utility/set_share_info';

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
    setTitle = ()=>{
        window.setTitle('专辑');
        var { topic, post_list, user, post, read_count } = this.props;
        var share_info = {
            title: `${topic.title} | ${user.nickname}的物记专辑`,
            desc: `该专辑共有${post_list.length}件好物，已获${read_count}次收听`,
            imgUrl: fconf.qiniu.site + post.pic_id + '-b80',
            link: fconf.site + '/app/topic/' + topic._id
        }
        console.log(share_info);
        setShareInfo(share_info);
    }
    componentDidMount() {
        this.setTitle();
        var playlist = this.props.post_list.map((post) => {
            return {
                audio_id: post.audio_id,
                post_id: post._id,
                user_id: post.user_id
            }
        });
        this.props.dispatch(createAction('set_playlist')(playlist));
    }
    componentDidUpdate() {
        this.setTitle();
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('set_playlist')(null));
    }
    onIconClick = (i, post) => {
        var { index, post_list, audio_player, dispatch } = this.props;
        if (i == index && audio_player.id == post.audio_id) {
            dispatch(createAction('stop')(post.audio_id));
        } else {
            dispatch(createAction('set_index')({
                index: i,
                play: true
            }));
        }
    }
    render() {
        var { post, post_list, user, topic, index, total_length, current_length, audio_player } = this.props;
        var progress = (current_length * 100 / total_length).toFixed(2);
        var current = moment(current_length + 500).format('mm:ss') + ' ' + topic.title;
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
                    <div styleName='icon-list'>
                        { post_list.map((post, i)=>(<PostSmallCard
                            post={post}
                            active={index == i}
                            onClick={()=>this.onIconClick(i, post)}
                            playing={audio_player.id == post.audio_id}
                        />)) }
                    </div>
                </div>
                <AuthorLine post={post} user={user} showComment={true}/>
            </div>
        )
    }
}

var get_user = (state, props) => state.users[props.topic.user_id];
var get_post_list = (state, props) => props.topic.posts.map(id=>state.posts[id]);
var get_index = state => (state.audio_player.index || 0);
var get_post = createSelector(
    [get_post_list, get_index],
    (post_list, index) => post_list[index]
);
var get_audios = state => state.audios;
var get_read_count = createSelector(
    [get_audios, get_post_list],
    (audios, post_list) => {
        return _.chain(post_list)
            .map(post=>post.audio_id)
            .map(audio_id=>audios[audio_id])
            .map(audio=>audio.read_count)
            .reduce((m, i) => (m+i), 0)
            .value();
    }
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
var mapStateToProps = createStructuredSelector({
    index: get_index,
    post_list: get_post_list,
    post: get_post,
    user: get_user,
    total_length: get_total_length,
    current_length: get_current_length,
    audio_player: get_audio_player,
    read_count: get_read_count
})

export default connect(mapStateToProps)(
    CSSModules(Topic, styles)
);
