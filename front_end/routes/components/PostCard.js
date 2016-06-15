import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import * as actions from '../../actions';
import AudioPlayer from './AudioPlayer';
import classNames from 'classnames';
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import screenSize from '../../utility/screen_size'
import qs from 'querystring'


class PostCard extends React.Component {
    constructor() {
        super();
    }
    gotoDetail = () => {
        var { user } = this.props;
        hashHistory.push('detail/' + user._id);
    }
    picHeight = () => {
        var { post } = this.props;
        var w = (screenSize().width - 6) / 2 - 10;
        var h = Math.floor(w * post.h / post.w + 0.5);
        return h;
    }
    like = () => {
        var { post, dispatch } = this.props;
        dispatch(actions.like(post._id));
    }
    render() {
        var { user, post } = this.props;
        var likes = post.others_like_count + (post.me_like ? 1 : 0)
        return (
            <div className="card" ref='card'>
                <div className="picture image-icon_image_loading"
                    style={{
                        height: this.picHeight()
                    }}>
                    <img src={fconf.qiniu.site + post.pic_id + '-c167'}
                        onClick={()=>hashHistory.push('post/' + post._id)}/>
                </div>
                <div className="audio-line">
                    <AudioPlayer audio_id={post.audio_id} length={post.length}/>
                    <span
                        className={classNames({
                            'image-btn_praise_selected': post.me_like,
                            'image-btn_praise_default': !post.me_like,
                            'praise-count': likes > 0,
                            'text-primary': post.me_like,
                            'text-secondary': !post.me_like,
                            'praise': true
                        })}
                        onClick={this.like}>
                        { likes > 0 && likes }
                    </span>
                </div>
                { user && <a className='user-line' onClick={()=>setTimeout(this.gotoDetail, 300)}>
                    <img className='avatar' src={user.headimgurl} />
                    <span className='nickname'>{user.nickname}</span>
                </a> }
            </div>
        );
    }
}

export default connect()(PostCard);
