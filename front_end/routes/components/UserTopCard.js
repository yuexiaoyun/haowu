import React from 'react';
import update from '../../utility/update';
import * as actions from '../../actions';
import { Link, hashHistory } from 'react-router';
import PopupHelper from '../../utility/PopupHelper';
import showProgress from '../../utility/show_progress';
import { connect } from 'react-redux';

var UserTopCard = ({user, subids, dispatch}) => {
    var sub = () => {
        dispatch(actions.sub({
            sub: !user.subbed,
            user_id: user._id
        }));
    }
    var preview = (e) => {
        wx.previewImage({
            current: user.headimgurl,
            urls: [user.headimgurl]
        });
    }
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
            <img className='avatar' src={user.headimgurl} onClick={preview}/>
            <div className='nickname'>{user.nickname}</div>
            { user._id != window.user_id &&
                <span className='btn-default' onClick={sub}>
                    {user.subbed ? '已订阅' : '订阅'}
                </span>
                || <span className='btn-default' onClick={()=>(subids && subids.length>0 && hashHistory.push('sub_list'))}>
                    {`${subids ? subids.length : 0}人订阅`}
                </span> }
        </div>
    );
};

export default connect(({subids}) => ({subids}))(UserTopCard)
