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
        wx.chooseImage({
            count: 1,
            success: res => {
                try {
                    var path = res.localIds[0].substring(20);
                    hashHistory.push('pub/' + path);
                } catch(err) {
                    alert(err);
                }
            }
        });
    }
    render() {
        var is_home = this.currentHash()=='#/home';
        var is_me = this.currentHash()=='#/me';
        return (
            <div className="page-group">
                <div className="page page-current">
                    <header className="bar bar-nav">
                        <h1 className="title">物我</h1>
                    </header>
                    { (is_home || is_me) && <nav className="bar bar-tab">
                        <a className={"tab-item" + (is_home ? ' active' : '')} href="#/home">
                            <span className="icon icon-home"></span>
                            <span className="tab-label">首页</span>
                        </a>
                        <span className={"tab-item"} onClick={this.take_photo}>
                            <span className="icon icon-edit"></span>
                        </span>
                        <a className={"tab-item" + (is_me ? ' active' : '')} href="#/me">
                            <span className="icon icon-me"></span>
                            <span className="tab-label">我</span>
                        </a>
                    </nav> }
                    <div className='content'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
