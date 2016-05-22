import React from 'react';
import { Link, hashHistory } from 'react-router';

export default class App extends React.Component {
    currentHash() {
        var hash = location.hash;
        var i = hash.indexOf('?');
        if (i >= 0)
            hash = hash.substring(0, i);
        return hash;
    }
    take_photo = () => {

    }
    render() {
        return (
            <div className="page-group">
                <div className="page page-current">
                    <header className="bar bar-nav">
                        <h1 className="title">物我</h1>
                    </header>
                    <nav className="bar bar-tab">
                        <a className={"tab-item" + (this.currentHash()=='#/home' ? ' active' : '')} href="#/home">
                            <span className="icon icon-home"></span>
                            <span className="tab-label">首页</span>
                        </a>
                        <span className={"tab-item"} onClick={this.take_photo}>
                            <span className="icon icon-edit"></span>
                        </span>
                        <a className={"tab-item" + (this.currentHash()=='#/me' ? ' active' : '')} href="#/me">
                            <span className="icon icon-me"></span>
                            <span className="tab-label">我</span>
                        </a>
                    </nav>
                    <div className='content'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
