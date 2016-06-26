import React from 'react';
import fconf from '../../fconf';
import { hashHistory } from 'react-router';
import classNames from 'classnames';
import _ from 'underscore';

import styles from './UserCard.css'
import CSSModules from 'react-css-modules';

var UserCard = ({user}) => {
    return (
        <div styleName='root' onClick={(e)=>{
            e.stopPropagation();
            hashHistory.push('detail/' + user._id);
        }} >
            <div styleName='avatar-container'>
                <img styleName='avatar' src={user.headimgurl} />
                { (user.sex == 1 || user.sex == 2) && <span styleName='gender' className={classNames({
                    'image-icon_male': user.sex == 1,
                    'image-icon_female': user.sex == 2
                })} />}
            </div>
            { user.reads_count > 0 && <div styleName='reads' className='reads image-icon_home_listened'>
                {user.reads_count || 0}
            </div> }
            { user.post_count > 0 && <div styleName='reads' className='image-icon_me_fatieshu'>
                {user.post_count || 0 }
            </div> }
            <div styleName='nickname'>
                { user.nickname }
            </div>
            { user.intro && <div styleName='intro'>{user.intro}</div> }
            { !user.intro && <div styleName='intro'>
                { user._id == window.user_id && '我很懒，还没有个人介绍' || 'Ta很懒，还没有个人介绍'}
            </div> }
        </div>
    )
}

export default CSSModules(UserCard, styles)
