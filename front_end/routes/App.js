import React from 'react';
import update from '../utility/update'
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { createStructuredSelector } from 'reselect'
import wx from 'weixin-js-sdk';

class App extends React.Component {
    take_photo = () => {
        wx.chooseImage({
            count: 1,
            success: res => {
                // TODO: 将path base64，去掉一个action
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
        var { children, location, badge } = this.props;
        var current_tab = 0;
        return (
            <div>
                {children}
                <div style={{width: '100%', height: '49px', clear:'both', overflow:'hidden'}} />
                <nav className="bar bar-tab">
                    <span className={"bar-tab-item"} onClick={()=>{
                        hashHistory.replace('/home/' + Date.parse(new Date()));
                    }}>
                        <span className={"setting-icon image-btn_tabbar_home" +
                            (location.pathname.substring(0, 5)=='/home' ? '_selected' : '')} />
                    </span>
                    <span className={"bar-tab-item"} onClick={this.take_photo}>
                        <span className="setting-icon image-btn_tabbar_photo"></span>
                    </span>
                    <span className={"bar-tab-item"} onClick={()=>{
                        hashHistory.replace('/detail/' + window.user_id);
                    }}>
                        <span className={"setting-icon image-btn_tabbar_me"
                        + (location.pathname=='/detail/' + window.user_id ? '_selected' : '')} />
                        { badge>0 && <span className="badge">{badge}</span> }
                    </span>
                </nav>
            </div>
        );
    }
}

export default connect(({badge})=>({badge}))(App);
