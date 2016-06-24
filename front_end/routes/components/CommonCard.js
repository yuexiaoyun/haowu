import React from 'react';
import fconf from '../../fconf';
import { Link, hashHistory } from 'react-router';
import _ from 'underscore';

export default ({user_id, avatar, txt, pic_id, new_item, children, onClick}) => {
    children = _.compact(children);
    var has_children = children && children.length>0;
    return (
        <div className={`list-item${new_item ? ' new_item' : ''}`} onClick={onClick || ()=>{}}>
            <div className='avatar-container'>
                <img className='avatar' src={avatar} onClick={(e)=>{
                    e.stopPropagation();
                    hashHistory.push('detail/' + user_id);
                }} />
            </div>
            { pic_id && <img className='picture' src={fconf.qiniu.site + pic_id + '-c167'} />}
            <div className="list-item-content">
                <div className={`nickname${has_children ? '':' only'}`}>{ txt }</div>
                { has_children && children }
            </div>
        </div>
    )
}
