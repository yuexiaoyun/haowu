import React from 'react';
import update from '../utility/update'
import { hashHistory } from 'react-router';
import { createAction } from 'redux-actions';

import btnTabbarHome from '../files/btn_tabbar_home.png'
import btnTabbarHomeSelected from '../files/btn_tabbar_home_selected.png'
import btnTabbarMe from '../files/btn_tabbar_me.png'
import btnTabbarMeSelected from '../files/btn_tabbar_me_selected.png'
import btnTabbarPhoto from '../files/btn_tabbar_photo.png'
import btnTabbarPhotoPressed from '../files/btn_tabbar_photo_pressed.png'

import { takePhoto } from '../ducks/local_pic_id';

import styles from './App.css';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

class App extends React.Component {
    take_photo = () => {
        this.props.dispatch(takePhoto(false));
    }
    componentDidMount() {
        update('/api/update_badge');
    }
    render() {
        var { children, location, badge, feed_empty, tooltip } = this.props;
        var current_tab = 0;
        return (
            <div>
                {children}
                <div style={{width: '100%', height: '49px', clear:'both', overflow:'hidden'}} />
                { tooltip && location.pathname.substring(0, 5)=='/home' && <div styleName='tooltip-container'>
                    <div styleName='tooltip'>发个好物~说出真实的自己</div>
                    <div styleName='triangle-container'>
                        <div styleName='triangle-down' />
                    </div>
                </div> || null }
                <nav styleName="bar">
                    <span styleName={"bar-tab-item"} onClick={()=>{
                        hashHistory.replace('/home');
                    }}>
                        <img styleName='icon'
                            src={(location.pathname.substring(0, 5)=='/home' ? btnTabbarHomeSelected : btnTabbarHome)} />
                        { badge>0 && <span styleName="badge">{badge}</span>
                        || feed_empty && <div styleName='new' /> }
                    </span>
                    <span styleName={"bar-tab-item"}>
                        <div styleName='take-photo-shadow' />
                        <div styleName='take-photo-container' />
                        <span styleName='take-photo' onClick={this.take_photo}/>
                    </span>
                    <span styleName={"bar-tab-item"} onClick={()=>{
                        hashHistory.replace('/detail/' + window.user_id);
                    }}>
                        <img styleName='icon'
                            src={(location.pathname=='/detail/'+window.user_id ? btnTabbarMeSelected : btnTabbarMe)} />
                    </span>
                </nav>
            </div>
        );
    }
}

var get_badge_count = state => state.badge.count;
var get_new = state => state.home.feed_ids.length == 0;
var get_tooltip = state => state.tooltip;
var mapStateToProps = createStructuredSelector({
    badge: get_badge_count,
    feed_empty: get_new,
    tooltip: get_tooltip
});

export default connect(mapStateToProps)(
    CSSModules(App, styles)
);
