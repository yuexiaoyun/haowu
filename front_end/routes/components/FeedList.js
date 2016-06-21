import React from 'react';
import { findDOMNode } from 'react-dom';
import PostCard from './PostCard';
import { connect } from 'react-redux';

class FeedList extends React.Component {
    constructor() {
        super();
        this.state = { width: window.innerWidth };
    }
    componentDidMount() {
        this.setSize();
        window.addEventListener('resize', this.setSize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.setSize);
    }
    setSize = () => {
        var dom = findDOMNode(this);
        this.setState({width: dom.clientWidth});
    }
    render() {
        var {ids, posts, users, showUser} = this.props;
        var {width} = this.state;
        var w = (width - 6) / 2;
        console.log(w);
        var styles = {
            d1: {
                width: '100%',
                paddingLeft: 3,
                paddingRight: 3
            },
            d2: () => {
                return {
                    width: w,
                    float: 'left'
                }
            }
        }
        return (
            <div style={styles.d1}>
                <div style={styles.d2()} key={'d1'}>{
                    ids && ids.map((id, i) => {
                        if (i % 2 == 0) {
                            return <PostCard key={id} w={w} post={posts[id]} user={showUser && users[posts[id].user_id] || null}/>;
                        } else {
                            return null;
                        }
                    })
                }</div>
                <div style={styles.d2()} key={'d2'}>{
                    ids && ids.map((id, i) => {
                        if (i % 2 == 1) {
                            return <PostCard key={id} w={w} post={posts[id]} user={showUser && users[posts[id].user_id] || null}/>;
                        } else {
                            return null;
                        }
                    })
                }</div>
                <div style={{width: '100%', height: 0, clear:'both', overflow:'hidden'}} />
            </div>
        );
    }
}

export default connect(({posts, users})=>({
    posts,
    users
}))(FeedList);
