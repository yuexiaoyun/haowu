import React from 'react';
import { hashHistory } from 'react-router';
import fconf from '../../fconf';
import { fromObjectId } from '../../utility/format_time';
import update from '../../utility/update';
import { sub, like } from '../../actions';
import qs from 'querystring';

import PopupHelper from '../../utility/PopupHelper'

import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import styles from './AuthorLine.css'
import CSSModules from 'react-css-modules'

class TopCard extends React.Component {
    constructor() {
        super();
        this.state = {}
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
    render() {
        var { user, post } = this.props;
        return (
            <div styleName="root" onClick={()=>hashHistory.push('/detail/' + user._id)}>
                <img styleName='avatar' src={user.headimgurl} />
                <div styleName='more-buttons' className='image-btn_more' onClick={this.more}/>
                <div
                    styleName={post.me_like && this.state.like ? 'amazing-animate' : 'more-buttons'}
                    className={post.me_like ? 'image-btn_like_details_HL' : 'image-btn_like_details'}
                    onClick={this.like}/>
                <span styleName='nickname'>{user.nickname}</span>
                <span className='text-secondary'>{ fromObjectId(post._id) }</span>
            </div>
        )
    }
}

export default connect()(
    CSSModules(TopCard, styles)
);
