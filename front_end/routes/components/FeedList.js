import React from 'react';
import PostCard from './PostCard';
import screenSize from '../../utility/screen_size';

module.exports = ({posts}) => {
    return (
        <div style={styles.d1}>
            <div style={styles.d2()}>{
                posts && posts.map((post, i) => {
                    if (i % 2 == 0) {
                        return <PostCard post={post} user={post.user}/>;
                    } else {
                        return null;
                    }
                })
            }</div>
            <div style={styles.d2()}>{
                posts && posts.map((post, i) => {
                    if (i % 2 == 1) {
                        return <PostCard post={post} user={post.user}/>;
                    } else {
                        return null;
                    }
                })
            }</div>
        </div>
    );
};

var styles = {
    d1: {
        width: '100%',
        paddingLeft: 3,
        paddingRight: 3
    },
    d2: () => {
        return {
            width: (screenSize().width - 6) / 2,
            float: 'left'
        }
    }
}
