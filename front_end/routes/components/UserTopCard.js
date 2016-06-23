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
import { get_posts, get_audios, get_subids } from '../../reselectors'
import _ from 'underscore';
import wx from 'weixin-js-sdk';

class UserTopCard extends React.Component {
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
            desc: '物我，好物有声',
            link: fconf.site + '/app/detail/' + user._id,
            imgUrl: user.headimgurl
        });
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
                    <div>长按识别二维码，关注“物我”公众号</div>
                    <div>朋友互动不遗漏</div>
                </div> }
                { user._id != window.user_id &&
                    <span className='btn-default' onClick={this.sub}>
                        {user.subbed ? '已订阅' : '订阅'}
                        </span>
                    || <span className='btn-default' onClick={()=>(subids && subids.length>0 && hashHistory.push('sub_list'))}>
                        {`${subids ? subids.length : 0}人订阅`}
                </span> }
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
            </div>
        );
    }
}

export default connect(createStructuredSelector({
    subids: get_subids
}))(UserTopCard);
