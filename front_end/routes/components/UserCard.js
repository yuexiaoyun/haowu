import React from 'react';
import fconf from '../../fconf';
import { Link, hashHistory } from 'react-router';
import classNames from 'classnames';
import _ from 'underscore';

export default ({user}) => {
    return (
        <div className={'list-item'} onClick={(e)=>{
            e.stopPropagation();
            hashHistory.push('detail/' + user._id);
        }} >
            <div className='avatar-container'>
                <img className='avatar' src={user.headimgurl} />
                { (user.sex == 1 || user.sex == 2) && <span className={classNames({
                    gender: true,
                    'image-icon_male': user.sex == 1,
                    'image-icon_female': user.sex == 2
                })} />}
            </div>
            { user.reads_count > 0 && <div className='reads image-icon_home_listened pull-right'>
                {user.reads_count || 0}
            </div> }
            { user.post_count > 0 && <div className='reads image-icon_me_fatieshu pull-right'>
                {user.post_count || 0 }
            </div> }
            <div className="list-item-content">
                <div className={'nickname'}>
                    { user.nickname }
                </div>
                <span className='comment-text'>
                    { user.intro || user._id == window.user_id && '我很懒，还没有个人介绍' || 'Ta很懒，还没有个人介绍' }
                </span>
            </div>
        </div>
    )
}
