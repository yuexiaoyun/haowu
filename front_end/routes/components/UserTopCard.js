import React from 'react';
import update from '../../utility/update';
import * as actions from '../../actions';
import { Link, hashHistory } from 'react-router';
import PopupHelper from '../../utility/PopupHelper';
import showProgress from '../../utility/show_progress';
import setShareInfo from '../../utility/set_share_info';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect'
import classNames from 'classnames';
import fconf from '../../fconf';
import { set_intro } from '../../actions';
import { get_posts, get_audios, get_subids } from '../../reselectors'
import _ from 'underscore';
import wx from 'weixin-js-sdk';

class IntroInput extends React.Component {
    componentDidMount() {
        this.refs.input.focus();
        this.refs.input.addEventListener('blur', () => {
            this.props.handleInput(this.refs.input.value);
        })
    }
    render() {
        var { user } = this.props;
        return (
            <div>
                <input ref='input' className='intro-input' defaultValue={user.intro}/>
            </div>
        );
    }
}

class UserTopCard extends React.Component {
    constructor() {
        super();
        this.state = { input: false };
    }
    sub = () => {
        var { user, dispatch } = this.props;
        dispatch(actions.sub({
            sub: !user.subbed,
            user_id: user._id
        }));
    }
    preview = (e) => {
        var { user } = this.props;
        wx.previewImage({
            current: user.headimgurl,
            urls: [user.headimgurl]
        });
    }
    componentDidMount() {
        this.setShareInfo();
    }
    componentDidUpdate() {
        this.setShareInfo();
    }
    setShareInfo = () => {
        var { user } = this.props;
        var title = user.nickname + '的好物记录';
        if (user.post_count > 0) {
            title = `${user.nickname}的${user.post_count}条好物记录`;
            if (user.reads_count > 10)
                title += `，已获${user.reads_count}次收听`;
        }
        console.log(title);
        setShareInfo({
            title,
            desc: '物记，好物有声',
            link: fconf.site + '/app/detail/' + user._id,
            imgUrl: user.headimgurl
        });
    }
    input = () => {
        var { user } = this.props;
        if (user._id == window.user_id) {
            this.setState({input: true});
        }
    }
    handleInput = (value) => {
        this.setState({input: false});
        this.props.dispatch(set_intro({intro: value}));
    }
    renderIntro() {
        var { user } = this.props;
        var className = user.intro ? 'intro' : 'intro-null';
        if (user._id == window.user_id) {
            className += ' intro-edit image-btn_edit_me';
        }
        return (
            <div>
                <div className={className} onClick={this.input}>
                    { user.intro || user._id == window.user_id && '我的爱好；我的个性...或者我的微信' || 'Ta很懒，还没有个人介绍' }
                </div>
            </div>
        );
    }
    renderInput() {
        return <IntroInput
            user={this.props.user}
            handleInput={this.handleInput}/>;
    }
    render() {
        var {user, subids, audio_total_read_count, dispatch} = this.props;
        return (
            <div className='user-detail'>
                { false && <div className='share-line'>
                    可以将好物清单分享给微信好友、朋友圈
                    <span className="arrow image-icon_me_up"/>
                </div> }
                { false && <div className='follow-line'>
                    <div>长按识别二维码，关注“物记”公众号</div>
                    <div>朋友互动不遗漏</div>
                </div> }
                { user._id != window.user_id &&
                    <span className='btn-default' onClick={this.sub}>
                        {user.subbed ? '已订阅' : '订阅'}
                    </span> || user.me_subids && user.me_subids.length > 0 &&
                    <span className='btn-default' onClick={()=>{
                        hashHistory.push('/me_sub_list');
                    }}>
                        订阅{user.me_subids.length}人
                    </span>
                }
                <div className='avatar-container'>
                    <img className='avatar' src={user.headimgurl} onClick={this.preview} />
                    { (user.sex == 1 || user.sex == 2) && <span className={classNames({
                        gender: true,
                        'image-icon_male': user.sex == 1,
                        'image-icon_female': user.sex == 2
                    })} />}
                </div>
                <div className='nickname'>
                    {user.nickname}
                </div>
                <div className='reads image-icon_me_fatieshu'>
                    {user.post_count || 0}
                </div>
                <div className='reads image-icon_home_listened'>
                    {user.reads_count || 0}
                </div>
                { this.state.input ? this.renderInput() : this.renderIntro() }
            </div>
        );
    }
}

export default connect(createStructuredSelector({
    subids: get_subids
}))(UserTopCard);
