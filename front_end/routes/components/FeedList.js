import React from 'react';
import PostCard from './PostCard';
import screenSize from '../../utility/screen_size';

module.exports = ({posts}) => {
    return (
        <div style={styles.d1}>
            <div style={styles.d2()} key={'d1'}>{
                posts && posts.map((post, i) => {
                    if (i % 2 == 0) {
                        return <PostCard key={post._id} post={post} user={post.user}/>;
                    } else {
                        return null;
                    }
                })
            }</div>
            <div style={styles.d2()} key={'d2'}>{
                posts && posts.map((post, i) => {
                    if (i % 2 == 1) {
                        return <PostCard key={post._id} post={post} user={post.user}/>;
                    } else {
                        return null;
                    }
                })
            }</div>
            <div style={{width: '100%', height: 0, clear:'both', overflow:'hidden'}} />
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
