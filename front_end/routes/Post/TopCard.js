import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import update from '../../utility/update';
import qs from 'querystring';

import Loader from '../components/Loader'
import PicDetail from './PicDetail'
import AuthorLine from './AuthorLine'

import { like } from '../../actions'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import styles from './TopCard.css'
import CSSModules from 'react-css-modules'

class TopCard extends React.Component {
    constructor() {
        super();
        this.state = {}
    }
    play = () => {
        var { post, playing, loading } = this.props;
        if (playing || loading) {
            this.props.dispatch(createAction('stop')(post.audio_id));
        } else {
            this.props.dispatch(createAction('play')({
                audio_id: post.audio_id,
                post_id: post._id,
                user_id: post.user_id
            }));
        }
    }
    like = (e) => {
        e.stopPropagation();
        var { post, dispatch } = this.props;
        if (!post.me_like) {
            this.setState({like: true});
            dispatch(like(post._id));
        } else {
            hashHistory.push('/like_list/' + post._id);
        }
    }
    render() {
        var { user, post, audio, playing, loading, time } = this.props;
        var d = Math.floor((post.length + 500) / 1000);
        var like_count = post.like_count;
        var read_count = audio && audio.read_count || 0;
        return (
            <div>
                <PicDetail
                    post={post}
                    user={user}
                    edit_title={this.props.edit_title}
                    startEditTitle={this.props.startEditTitle}
                    handleEditTitle={this.props.handleEditTitle} />
                <div styleName='audio-line'>
                    <div styleName='audio-line-tab'>
                        <div styleName='read-count-container'>
                            <span styleName='read-count'
                                onClick={()=>(read_count > 0 && hashHistory.push('/read_list/'+post.audio_id))}>
                                { read_count }
                            </span>
                        </div>
                    </div>
                    <div styleName='audio-line-tab'>
                        <div
                            onClick={this.play}
                            styleName='lzw'
                            className={`${(playing || loading) ? 'image-btn_play_stop' : 'image-btn_play_start'}`} />
                    </div>
                    <div styleName='audio-line-tab'>
                        <div className='clear-fix' styleName='like-count-container'>
                            <span styleName={post.me_like ? 'like-count-liked' : 'like-count'}
                                onClick={this.like}>
                                { like_count }
                            </span>
                        </div>
                    </div>
                </div>
                <div styleName='audio-length'>
                    {loading ? <Loader no_text={true} />: `${playing ? time : d}"`}
                </div>
                <AuthorLine post={post} user={user} />
            </div>
        )
    }
}

var mapStateToProps = (state, props) => {
    var { post, user } = props;
    var audio = state.audios[post.audio_id];
    var { id, play_state, time } = state.audio_player;
    var playing = (post && id == post.audio_id && play_state == 'playing');
    var loading = (post && id == post.audio_id && play_state == 'loading');
    time = Math.floor(time / 1000 + 0.5);
    return {
        audio, playing, loading, time
    };
};


export default connect(mapStateToProps)(
    CSSModules(TopCard, styles)
);
