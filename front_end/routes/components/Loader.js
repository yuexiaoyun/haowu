import React from 'react';
import LoadingView from './LoadingView';

export default ({no_text}) => {
    return (
        <div style={styles.d}>
            <div className='loader-circle image-image_loading' />
            {!no_text && <div style={styles.txt}>加载中</div>}
        </div>
    );
}

var styles = {
    d: {
        height: 32,
        paddingTop: 8,
        align: 'center',
        textAlign: 'center'
    },
    txt: {
        display: 'inline-block',
        marginLeft: 8,
        lineHeight: '16px',
        fontSize: 12,
        textColor: '#666666'
    }
}
