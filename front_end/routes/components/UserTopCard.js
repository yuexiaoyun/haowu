import React from 'react';
import CssButton from './CssButton';
import { Link, hashHistory } from 'react-router';

module.exports = ({user, sub, subbed}) => {
    return (
        <div>
            { false && <div style={styles.d0}>
                可以将好物清单分享给微信好友、朋友圈
                <span style={styles.arrow}>
                    <CssButton className='image-icon_me_up' width={9} height={12}/>
                </span>
            </div> }
            { false && <div style={styles.d1}>
                <div style={styles.d11}></div>
                <div style={styles.d12}>
                    <div>长按识别二维码，关注“物我”公众号</div>
                    <div>朋友互动不遗漏</div>
                </div>
            </div> }
            <div style={styles.d2}>
                <img src={user.headimgurl} style={styles.avatar}></img>
                <div style={styles.n}>{user.nickname}</div>
                { user.openid != window.openid && <div style={styles.d20}>
                    <span style={styles.sub} onClick={sub}>{subbed ? '已订阅' : '订阅'}</span>
                </div> || <div style={styles.d20}>
                    <span style={styles.sub} onClick={()=>(user.subids&& user.subids.length>0 && hashHistory.push('sub_list'))}>
                        {`${user.subids ? user.subids.length : 0}人订阅`}
                    </span>
                </div>}
            </div>
        </div>
    );
};

var styles = {
    d0: {
        height: 32,
        lineHeight: '32px',
        width: "100%",
        paddingLeft: 20,
        fontSize: 12,
        color: '#ffffff',
        backgroundColor: '#6699cc'
    },
    arrow: {
        float: 'right',
        marginRight: 20
    },
    d1: {
        height: 48,
        width: "100%",
        paddingLeft: 20,
        backgroundColor: '#81d9d0',
        display: 'table'
    },
    d2: {
        align: 'center',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 24,
        width: '100%'
    },
    d20: {
        marginTop: 24
    },
    d11: {
        display: 'table-cell'
    },
    d12: {
        display: 'table-cell',
        height: 48,
        verticalAlign: 'middle',
        lineHeight: 1,
        fontSize: 14,
        color: '#ffffff',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    n: {
        marginTop: 20,
        fontSize: 17,
        color: '#000000'
    },
    sub: {
        display: 'inline-block',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 12,
        height: 24,
        fontSize: 12,
        lineHeight: '24px',
        border: '1px solid rgba(0, 0, 0, 0.15)',
    }
}
