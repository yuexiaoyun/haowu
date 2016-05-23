import React from 'react';
import { Link, hashHistory } from 'react-router';
import { takePic } from '../actions';
import { connect } from 'react-redux';

var App = ({children, dispatch}) => {
    function currentHash() {
        var hash = location.hash;
        var i = hash.indexOf('?');
        if (i >= 0)
            hash = hash.substring(0, i);
        return hash;
    }
    function take_photo() {
        wx.chooseImage({
            count: 1,
            success: res => {
                try {
                    var path = res.localIds[0];
                    dispatch(takePic(path));
                    hashHistory.push('pub');
                } catch(err) {
                    alert(err);
                }
            }
        });
    }
    var is_home = currentHash()=='#/home';
    var is_me = currentHash()=='#/me';
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
                    <span className={"tab-item"} onClick={take_photo}>
                        <span className="icon icon-edit"></span>
                    </span>
                    <a className={"tab-item" + (is_me ? ' active' : '')} href="#/home">
                        <span className="icon icon-me"></span>
                        <span className="tab-label">我</span>
                    </a>
                </nav> }
                <div className='content'>
                    {children}
                </div>
            </div>
        </div>
    );
};

module.exports = connect()(App);
