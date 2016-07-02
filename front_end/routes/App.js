import React from 'react';
import update from '../utility/update'
import { hashHistory } from 'react-router';
import { createAction } from 'redux-actions';
import wx from 'weixin-js-sdk';

import styles from './App.css';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

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
        update('/api/update_badge');
    }
    render() {
        var { children, location, badge, feed_empty } = this.props;
        var current_tab = 0;
        return (
            <div>
                {children}
                <div style={{width: '100%', height: '49px', clear:'both', overflow:'hidden'}} />
                <nav styleName="bar">
                    <span styleName={"bar-tab-item"} onClick={()=>{
                        hashHistory.replace('/home/' + Date.parse(new Date()));
                    }}>
                        <span styleName='setting-icon' className={"image-btn_tabbar_home" +
                            (location.pathname.substring(0, 5)=='/home' ? '_selected' : '')} />
                        { badge>0 && <span styleName="badge">{badge}</span>
                        || feed_empty && <div styleName='new' /> }
                    </span>
                    <span styleName={"bar-tab-item"} onClick={this.take_photo}>
                        <span styleName='setting-icon' className="image-btn_tabbar_photo"></span>
                    </span>
                    <span styleName={"bar-tab-item"} onClick={()=>{
                        hashHistory.replace('/detail/' + window.user_id);
                    }}>
                        <span styleName='setting-icon' className={"image-btn_tabbar_me"
                        + (location.pathname=='/detail/' + window.user_id ? '_selected' : '')} />
                    </span>
                </nav>
            </div>
        );
    }
}

var get_badge_count = state => state.badge.count;
var get_new = state => state.feed_ids.length == 0;
var mapStateToProps = createStructuredSelector({
    badge: get_badge_count,
    feed_empty: get_new
});

export default connect(mapStateToProps)(
    CSSModules(App, styles)
);
