import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import { fromObjectId } from '../../utility/format_time';
import PopupHelper from '../../utility/PopupHelper'
import update from '../../utility/update';
import Loader from '../components/Loader'
import { play, stop } from '../../utility/audio_manager';
import { sub, like } from '../../actions';
import qs from 'querystring';
import wx from 'weixin-js-sdk';

import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import styles from './TopCard.css'
import CSSModules from 'react-css-modules'

class TopCard extends React.Component {
    constructor() {
        super();
        this.state = {}
    }
    componentWillUnmount() {
        var { post, playing, loading } = this.props;
        if (playing || loading)
            stop(post.audio_id);
    }
    play = () => {
        var { post, playing, loading } = this.props;
        if (playing || loading)
            stop(post.audio_id);
        else
            play(post.audio_id, post._id, post.user_id);
    }
    preview = (e) => {
        var { post } = this.props;
        fetch('/ping/feed?' + qs.stringify({
            post_id: post._id,
            type: 'enter_image_detail'
        }), {credentials: 'same-origin'});
        wx.previewImage({
            current: fconf.qiniu.site + post.pic_id,
            urls: [fconf.qiniu.site + post.pic_id]
        });
    }
    more = (e) => {
        e.stopPropagation();
        var { post, user } = this.props;
        if (window.user_id == post.user_id) {
            PopupHelper.menu([{
                text: '删除',
                f: this.deletePost
            }]);
        } else {
            var text = user.subbed ? '取消订阅' : '订阅';
            PopupHelper.menu([{
                text,
                f: ()=>{
                    this.props.dispatch(sub({
                        user_id: post.user_id,
                        sub: user.subbed ? 0 : 1
                    }));
                }
            }]);
        }
    }
    like = (e) => {
        e.stopPropagation();
        var { post, dispatch } = this.props;
        if (!post.me_like) {
            this.setState({like: true});
            dispatch(like(post._id));
        }
    }
    deletePost = () => {
        PopupHelper.confirm('您确认要删除么', '删除', ()=>{
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
                    PopupHelper.toast('删除失败');
                });
        });
    }
    postfix = () => {
        var width = window.innerWidth;
        if (width > window.innerHeight)
            width = window.innerHeight;
        if (width == 320)
            return '-d640';
        else if (width == 360)
            return '-d720';
        else
            return '-d750';
    }
    render() {
        var { user, post, audio, playing, loading, time } = this.props;
        var d = Math.floor((post.length + 500) / 1000);
        var like_count = post.like_count;
        var read_count = audio && audio.read_count || 0;
        return (
            <div>
                <div className="image-image_default_home" styleName='picture'>
                    <div styleName='picture-dummy' />
                    <img src={fconf.qiniu.site + post.pic_id + this.postfix()}
                        styleName='picture-img'
                        style={post.w > post.h ? {height: '100%'} : {width: '100%'}}
                        onClick={this.preview}/>
                </div>
                <div styleName='audio-line'>
                    <div styleName='audio-line-tab'>
                        <span className='pull-right btn-default'
                            onClick={()=>(read_count > 0 && hashHistory.push('/read_list/'+post.audio_id))}>
                            { read_count }人听过
                        </span>
                    </div>
                    <div styleName='audio-line-tab'>
                        <div
                            onClick={this.play}
                            styleName='lzw'
                            className={`${(playing || loading) ? 'image-btn_play_stop' : 'image-btn_play_start'}`} />
                    </div>
                    <div styleName='audio-line-tab'>
                        <span className='pull-left btn-default clearfix'
                            onClick={()=>(like_count > 0 && hashHistory.push('/like_list/'+post._id))}>
                            { like_count }人赞过
                        </span>
                    </div>
                </div>
                <div styleName='audio-length'>
                    {loading ? <Loader no_text={true} />: `${playing ? time : d}"`}
                </div>
                <div styleName="author-line" onClick={()=>hashHistory.push('/detail/' + user._id)}>
                    <img styleName='avatar' src={user.headimgurl} />
                    <div styleName='more-buttons' className='image-btn_more' onClick={this.more}/>
                    <div
                        styleName={post.me_like && this.state.like ? 'amazing-animate' : 'more-buttons'}
                        className={post.me_like ? 'image-btn_like_details_HL' : 'image-btn_like_details'}
                        onClick={this.like}/>
                    <span styleName='nickname'>{user.nickname}</span>
                    <span className='text-secondary'>{ fromObjectId(post._id) }</span>
                </div>
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
