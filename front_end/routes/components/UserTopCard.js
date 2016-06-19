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
        var { user, post_count, audio_total_read_count } = this.props;
        var title = user.nickname + '的好物记录';
        if (post_count > 0) {
            title = `${user.nickname}的${post_count}条好物记录`;
            if (audio_total_read_count > 10)
                title += `，已获${audio_total_read_count}次收听`;
        }
        console.log(title);
        setShareInfo({
            title,
            desc: '物我，好物有声',
            link: fconf.site + '/app#/detail/' + user._id,
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
                    { user.sex && <span className={classNames({
                        gender: true,
                        'image-icon_male': user.sex == 1,
                        'image-icon_female': user.sex == 2
                    })} />}
                </div>
                <div className='nickname'>
                    {user.nickname}
                </div>
                <div className='reads image-icon_home_listened'>
                    {audio_total_read_count}
                </div>
            </div>
        );
    }
}

const get_post_ids = (state, props) => state.user_post_ids[props.user._id];
const get_post_count = createSelector(
    [get_post_ids],
    (post_ids) => ((post_ids || []).length)
);

const get_audio_total_read_count = createSelector(
    [get_post_ids, get_posts, get_audios],
    (post_ids, posts, audios) => {
        if (!post_ids)
            return 0;
        return _.chain(post_ids)
            .map(id=>posts[id])
            .map(post=>post.audio_id)
            .map(audio_id=>audios[audio_id])
            .compact()
            .map(audio=>(audio.others_read_count + (audio.me_read ? 1 : 0)))
            .reduce((memo, num)=>(memo + num), 0)
            .value();
    }
)

export default connect(createStructuredSelector({
    post_count: get_post_count,
    audio_total_read_count: get_audio_total_read_count,
    subids: get_subids
}))(UserTopCard);
