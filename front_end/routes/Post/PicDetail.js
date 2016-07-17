import React from 'react';
import update from '../../utility/update';
import fconf from '../../fconf';
import qs from 'querystring';
import wx from 'weixin-js-sdk';

import TitleInput from './TitleInput'

import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import styles from './PicDetail.css'
import CSSModules from 'react-css-modules'

import btnTitleDetails from '../../files/btn_title_details.png';

class PicDetail extends React.Component {
    constructor() {
        super();
        this.state = {}
    }
    postfix = () => {
        var width = window.innerWidth;
        if (width > window.innerHeight)
            width = window.innerHeight;
        if (width == 320)
            return '-d640';
        else if (width == 375)
            return '-d750';
        else if (width == 414)
            return '-d1242';
        else
            return '-d720';
    }
    preview = (e) => {
        var { post } = this.props;
        console.log(this.state.input);
        if (this.props.edit_title != 1) {
            fetch('/ping/feed?' + qs.stringify({
                post_id: post._id,
                type: 'enter_image_detail'
            }), {credentials: 'same-origin'});
            wx.previewImage({
                current: fconf.qiniu.site + post.pic_id,
                urls: [fconf.qiniu.site + post.pic_id]
            });
        }
    }
    render() {
        var { post, user, children } = this.props;
        var showTitle = !!post.title;
        if (this.props.startEditTitle) {
            showTitle = showTitle || (post.user_id == window.user_id)
        }
        return (
            <div className="image-image_default_home" styleName='root'>
                <div styleName='picture-dummy' />
                <img src={fconf.qiniu.site + post.pic_id + this.postfix()}
                    styleName='picture-img'
                    style={post.w > post.h ? {height: '100%'} : {width: '100%'}}
                    onClick={this.preview}/>
                {(showTitle) && <div styleName='title' onClick={this.props.startEditTitle || (()=>{}) }>
                    { this.props.edit_title == 1 && <TitleInput post={post} handleInput={this.props.handleEditTitle}/>}
                    { this.props.edit_title != 1 && <div>
                        <img src={btnTitleDetails} styleName='edit'/>
                        {post.title || '好标题让人更愿意听你的分享'}
                    </div>}
                </div>}
                { children }
            </div>
        );
    }
}

export default CSSModules(PicDetail, styles)
