import React from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

class App extends React.Component {
    currentHash = () => {
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
                    var path = res.localIds[0];
                    this.props.dispatch(createAction('take_pic')(path));
                    hashHistory.push('pub');
                } catch(err) {
                    alert(err);
                }
            }
        });
    }
    render() {
        try {
            var { children } = this.props;
            var is_home = this.currentHash()=='#/home';
            var is_me = this.currentHash()=='#/me';
            return (
                <div className="page-group">
                    <div className="page page-current">
                        { (is_home || is_me) && <nav className="bar bar-tab">
                            <a className={"tab-item"} href="#/home">
                                <span className={"setting-icon image-btn_tabbar_home" + (is_home ? '_selected' : '')} />
                            </a>
                            <span className={"tab-item"} onClick={this.take_photo}>
                                <span className="setting-icon image-btn_tabbar_photo"></span>
                            </span>
                            <a className={"tab-item"} href="#/me">
                                <span className={"setting-icon image-btn_tabbar_me" + (is_me ? '_selected' : '')} />
                            </a>
                        </nav> }
                        {children}
                    </div>
                </div>
            );
        } catch(err) {
            alert(err);
        }
    }
}

module.exports = connect(state=>({home_scroll: state.home_scroll}))(App);
