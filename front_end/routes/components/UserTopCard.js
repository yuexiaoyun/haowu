import React from 'react';
import CssButton from './CssButton';

module.exports = ({user}) => {
    return (
        <div>
            <div style={styles.d0}>
                可以将好物清单分享给微信好友、朋友圈
                <span style={styles.arrow}>
                    <CssButton className='image-icon_me_up' width={9} height={12}/>
                </span>
            </div>
            <div style={styles.d1}>
                <div style={styles.d11}></div>
                <div style={styles.d12}>
                    <div>长按识别二维码，关注“物我”公众号</div>
                    <div>朋友互动不遗漏</div>
                </div>
            </div>
            <div style={styles.d2}>
                <img src={user.headimgurl} style={styles.avatar}></img>
                <div style={styles.n}>{user.nickname}</div>
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
    }
}
