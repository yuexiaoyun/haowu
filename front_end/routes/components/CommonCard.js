import React from 'react';
import fconf from '../../fconf';
import { Link, hashHistory } from 'react-router';

export default ({openid, avatar, txt, pic_id, new_item, onClick}) => {
    return (
        <div style={styles.d(new_item)} onClick={onClick || ()=>{}}>
            <div style={styles.d1} onClick={(e)=>{
                e.stopPropagation();
                hashHistory.push('detail/' + openid);
            }}>
                <img src={avatar} style={styles.avatar} />
            </div>
            <div style={styles.d2}>
                { txt }
            </div>
            { pic_id && <div style={styles.d3}>
                <img src={fconf.qiniu.site + pic_id + '-c167'} style={styles.pic} />
            </div> }
        </div>
    )
}

var styles = {
    d: (new_item) => ({
        height: 60,
        width: '100%',
        borderBottom: '1px solid #dfdfdd',
        backgroundColor: new_item ? '#f1e8e8' : undefined
    }),
    d1: {
        float: 'left'
    },
    d2: {
        display: 'inline-block',
        lineHeight: '60px',
        fontSize: 14,
        textColor: '#666666'
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
