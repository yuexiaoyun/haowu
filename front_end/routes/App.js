import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

import Home from './Home'
import Me from './Me'

class App extends React.Component {
    take_photo = () => {
        wx.chooseImage({
            count: 1,
            success: res => {
                var path = res.localIds[0];
                this.props.dispatch(createAction('take_pic')(path));
                hashHistory.push('pub');
            }
        });
    }
    render() {
        try {
            var { my_badge, children, location } = this.props;
            var current_tab = 0;
            return (
                <div>
                    <Helmet title='物我' />
                    {children}
                    <div style={{width: '100%', height: '2.5rem', clear:'both', overflow:'hidden'}} />
                    <nav className="bar bar-tab">
                        <span className={"tab-item"} onClick={()=>{
                            if (location.pathname=='/home') {
                                this.refs.home.getWrappedInstance().reload();
                                //this._home.getWrappedInstance().reload();
                            }
                            hashHistory.replace('/home');
                        }}>
                            <span className={"setting-icon image-btn_tabbar_home" + (location.pathname=='/home' ? '_selected' : '')} />
                        </span>
                        <span className={"tab-item"} onClick={this.take_photo}>
                            <span className="setting-icon image-btn_tabbar_photo"></span>
                        </span>
                        <span className={"tab-item"} onClick={()=>{
                            hashHistory.replace('/me/posts');
                        }}>
                            <span className={"setting-icon image-btn_tabbar_me"
                            + ((location.pathname=='/me/posts' || location.pathname=='/me/notifications') ? '_selected' : '')} />
                            { my_badge>0 && <span className="badge">{my_badge}</span> }
                        </span>
                    </nav>
                </div>
            );
        } catch(err) {
            alert(err);
        }
    }
}

export default connect(state=>({
    my_badge: state.my_badge
}))(App);
