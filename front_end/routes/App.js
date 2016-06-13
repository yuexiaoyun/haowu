import React from 'react';
import Helmet from 'react-helmet'
import update from '../utility/update'
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { createStructuredSelector } from 'reselect'
import { get_badge_count } from '../reselectors'

import Home from './Home'
import Me from './Me'

// TODO: 点击Home键刷新Feed流
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
    componentDidMount() {
        update('/api/update_me');
    }
    render() {
        try {
            var { badge_count, children, location } = this.props;
            var current_tab = 0;
            return (
                <div>
                    <Helmet title='物记' />
                    {children}
                    <div style={{width: '100%', height: '2.5rem', clear:'both', overflow:'hidden'}} />
                    <nav className="bar bar-tab">
                        <span className={"bar-tab-item"} onClick={()=>{
                            if (location.pathname=='/home') {
                                this.refs.home.getWrappedInstance().reload();
                                //this._home.getWrappedInstance().reload();
                            }
                            hashHistory.replace('/home');
                        }}>
                            <span className={"setting-icon image-btn_tabbar_home" + (location.pathname=='/home' ? '_selected' : '')} />
                        </span>
                        <span className={"bar-tab-item"} onClick={this.take_photo}>
                            <span className="setting-icon image-btn_tabbar_photo"></span>
                        </span>
                        <span className={"bar-tab-item"} onClick={()=>{
                            hashHistory.replace('/me/posts');
                        }}>
                            <span className={"setting-icon image-btn_tabbar_me"
                            + ((location.pathname=='/me/posts' || location.pathname=='/me/notifications') ? '_selected' : '')} />
                            { badge_count>0 && <span className="badge">{badge_count}</span> }
                        </span>
                    </nav>
                </div>
            );
        } catch(err) {
            alert(err);
        }
    }
}

export default connect(createStructuredSelector({
    badge_count: get_badge_count
}))(App);
