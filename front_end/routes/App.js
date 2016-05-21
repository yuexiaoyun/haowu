import React from 'react';
import { Link } from 'react-router';

export default class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
                <div><Link to="pub">测试发布</Link></div>
                <div><Link to="post/574036a89cff05bcd2630ec3">测试详情页</Link></div>
            </div>
        );
    }
}
