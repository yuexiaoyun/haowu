import React from 'react';
import fconf from '../../fconf';
import { Link, hashHistory } from 'react-router';
import _ from 'underscore';

export default ({openid, avatar, txt, pic_id, new_item, children, onClick}) => {
    children = _.compact(children);
    var has_children = children && children.length>0;
    return (
        <div style={styles.d(new_item)} onClick={onClick || ()=>{}}>
            <div style={styles.d1} onClick={(e)=>{
                e.stopPropagation();
                hashHistory.push('detail/' + openid);
            }}>
                <img src={avatar} style={styles.avatar} />
            </div>
            <div style={styles.d1}>
                <div style={styles.d2(has_children)}>{ txt }</div>
                { has_children && <div style={styles.d20}>{children}</div>}
            </div>
            { pic_id && <div style={styles.d3}>
                <img src={fconf.qiniu.site + pic_id + '-c167'} style={styles.pic} />
            </div> }
        </div>
    )
}

var styles = {
    d: (new_item) => ({
        width: '100%',
        borderBottom: '1px solid #dfdfdd',
        backgroundColor: new_item ? '#f1e8e8' : undefined,
        clear: 'both',
        overflow: 'hidden'
    }),
    d1: {
        float: 'left'
    },
    d2: (has_children) => ({
        lineHeight: has_children ? '40px' : '60px',
        fontSize: 14,
        textColor: '#666666'
    }),
    d20: {
        marginBottom: 8
    },
    d3: {
        float: 'right'
    },
    avatar: {
        marginTop: 15,
        marginLeft: 16,
        marginRight: 16,
        width: 30,
        height: 30,
        borderRadius: '15px'
    },
    pic: {
        marginTop: 15,
        width: 30,
        height: 30,
        marginRight: 16
    }
}
