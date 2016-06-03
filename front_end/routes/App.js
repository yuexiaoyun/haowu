import React from 'react';
import Helmet from 'react-helmet'
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

import Home from './Home'
import Me from './Me'

var Tab = connect(state=>({
    current_tab: state.current_tab
}))(({current_tab, index, className, badge, dispatch}) => (
    <span className={"tab-item"} onClick={()=>{
        dispatch(createAction('current_tab')(index));
    }}>
        <span className={"setting-icon " + className + (current_tab == index ? '_selected' : '')} />
        { badge>0 && <span className="badge">{badge}</span> }
    </span>
));

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
            var { current_tab, my_badge } = this.props;
            return (
                <div>
                    <Helmet title='物我' />
                    {current_tab == 0 ? <Home /> : <Me />}
                    <div style={{width: '100%', height: '2.5rem', clear:'both', overflow:'hidden'}} />
                    <nav className="bar bar-tab">
                        <Tab index={0} className={"image-btn_tabbar_home"} />
                        <span className={"tab-item"} onClick={this.take_photo}>
                            <span className="setting-icon image-btn_tabbar_photo"></span>
                        </span>
                        <Tab index={1} className={"image-btn_tabbar_me"} badge={my_badge}/>
                    </nav>
                </div>
            );
        } catch(err) {
            alert(err);
        }
    }
}

export default connect(state=>({
    current_tab: state.current_tab,
    my_badge: state.my_badge
}))(App);
