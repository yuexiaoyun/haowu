import React from 'react';
import PostCard from './PostCard';
import screenSize from '../../utility/screen_size';
import { connect } from 'react-redux';

// TODO: 高度计算布局
var FeedList = ({ids, posts, users, showUser}) => {
    return (
        <div style={styles.d1}>
            <div style={styles.d2()} key={'d1'}>{
                ids && ids.map((id, i) => {
                    if (i % 2 == 0) {
                        return <PostCard key={id} post={posts[id]} user={showUser && users[posts[id].user_id] || null}/>;
                    } else {
                        return null;
                    }
                })
            }</div>
            <div style={styles.d2()} key={'d2'}>{
                ids && ids.map((id, i) => {
                    if (i % 2 == 1) {
                        return <PostCard key={id} post={posts[id]} user={showUser && users[posts[id].user_id] || null}/>;
                    } else {
                        return null;
                    }
                })
            }</div>
            <div style={{width: '100%', height: 0, clear:'both', overflow:'hidden'}} />
        </div>
    );
};
export default connect(({posts, users})=>({
    posts,
    users
}))(FeedList);

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
