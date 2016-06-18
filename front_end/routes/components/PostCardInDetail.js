import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { fromObjectId } from '../../utility/format_time';
import screenSize from '../../utility/screen_size'
import PopupHelper from '../../utility/PopupHelper'
import update from '../../utility/update';
import Loader from './Loader'
import { play, stop } from '../../utility/audio_manager';
import { sub } from '../../actions';
import qs from 'querystring';


class PostCardInDetail extends React.Component {
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
            play(post.audio_id, post._id);
    }
    preview = (e) => {
        var { post } = this.props;
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
    render() {
        var { user, post, like_count, read_count, playing, loading, time } = this.props;
        var d = Math.floor((post.length + 500) / 1000);
        return (
            <div>
                <div className="picture image-icon_image_loading"
                    style={{
                        height: screenSize().width,
                    }}>
                    <img src={fconf.qiniu.site + post.pic_id + '-c720'}
                        style={post.w > post.h ? {height: '100%'} : {width: '100%'}}
                        onClick={this.preview}/>
                </div>
                <div className='audio-line'>
                    <div className='audio-line-tab'>
                        <span className='pull-right btn-default'
                            onClick={()=>(like_count > 0 && hashHistory.push('/like_list/'+post._id))}>
                            { like_count }人赞过
                        </span>
                    </div>
                    <div className='audio-line-tab'>
                        <div
                            onClick={this.play}
                            className={`lzw ${(playing || loading) ? 'image-btn_play_stop' : 'image-btn_play_start'}`} />
                    </div>
                    <div className='audio-line-tab'>
                        <span className='pull-left btn-default clearfix'
                            onClick={()=>(read_count > 0 && hashHistory.push('/read_list/'+post.audio_id))}>
                            { read_count }人听过
                        </span>
                    </div>
                </div>
                <div className='audio-length'>
                    {loading ? <Loader no_text={true} />: `${playing ? time : d}"`}
                </div>
                <div className="author-line" onClick={()=>hashHistory.push('/detail/' + user._id)}>
                    <img className='avatar' src={user.headimgurl} />
                    <div className='delete image-btn_more' onClick={this.more}/>
                    <span className='nickname'>{user.nickname}</span>
                    <span className='text-secondary'>{ fromObjectId(post._id) }发布</span>
                </div>
            </div>
        )
    }
}

export default connect((state, props) => {
    var { post, user } = props;
    var like_count = post.others_like_count + (post.me_like ? 1 : 0);
    var audio = state.audios[post.audio_id];
    var read_count = audio ? (audio.others_read_count + (audio.me_read ? 1 : 0)) : 0;
    var { id, play_state, time } = state.audio_player;
    var playing = (post && id == post.audio_id && play_state == 'playing');
    var loading = (post && id == post.audio_id && play_state == 'loading');
    time = Math.floor(time / 1000 + 0.5);
    return {
        like_count, read_count, playing, loading, time
    };
})(PostCardInDetail);
