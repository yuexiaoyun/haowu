import React from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

import Home from './Home'
import Me from './Me'

var Tab = connect(state=>({
    current_tab: state.current_tab
}))(({current_tab, index, className, dispatch}) => (
    <span className={"tab-item"} onClick={()=>{
        dispatch(createAction('current_tab')(index));
    }}>
        <span className={"setting-icon " + className + (current_tab == index ? '_selected' : '')} />
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
            var { current_tab } = this.props;
            return (
                <div>
                    <nav className="bar bar-tab">
                        <Tab index={0} className={"image-btn_tabbar_home"} />
                        <span className={"tab-item"} onClick={this.take_photo}>
                            <span className="setting-icon image-btn_tabbar_photo"></span>
                        </span>
                        <Tab index={1} className={"image-btn_tabbar_me"} />
                    </nav>
                    {current_tab == 0 ? <Home /> : <Me />}
                </div>
            );
        } catch(err) {
            alert(err);
        }
    }
}

export default connect(state=>({
    current_tab: state.current_tab
}))(App);
