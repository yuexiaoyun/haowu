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
            </div>
            { user.reads_count > 0 && <div styleName='read-count'>
                {user.reads_count || 0}
            </div> }
            { user.post_count > 0 && <div styleName='post-count'>
                {user.post_count || 0 }
            </div> }
            <div styleName='content'>
                <div styleName='nickname'>
                    { user.nickname }
                </div>
                { user.intro && <div styleName='intro'>{user.intro}</div> }
                { !user.intro && <div styleName='intro'>
                    { user._id == window.user_id && '我很懒，还没有个人介绍' || 'Ta很懒，还没有个人介绍'}
                </div> }
            </div>
        </div>
    )
}

export default CSSModules(UserCard, styles)
