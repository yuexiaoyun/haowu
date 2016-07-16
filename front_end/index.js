import "babel-polyfill";
import 'whatwg-fetch';
import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { applyRouterMiddleware, Router, Route, Link, Redirect, IndexRedirect, hashHistory } from 'react-router'
import useScroll from 'react-router-scroll';
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createAction } from 'redux-actions';
import optimist from 'redux-optimist';
import thunk from 'redux-thunk';
import optimistPromiseMiddleware from 'redux-optimist-promise';
import { audioPlayerMiddleware } from './ducks/audio_player';
import wx from 'weixin-js-sdk';

import App from './routes/App'
import Home from './routes/Home'

import PopupHelper from './utility/PopupHelper'
import * as reducers from './reducers'
import { setStore as s1 } from './utility/update'

import './utility/set_title'
import './less/sm.less'

if (process.env.NODE_ENV != 'production') {
    console.log('in development');
    window.onerror = alert;
}

var entry = window.location.hash.substring(1);
if (entry.substring(0, 5) == '/post') {
    hashHistory.replace('/home');
    var i = entry.indexOf('?');
    if (i >= 0)
        entry = entry.substring(0, i);
    setTimeout(()=>hashHistory.push(entry), 0);
}

let store = applyMiddleware(
    audioPlayerMiddleware,
    optimistPromiseMiddleware(),
    thunk,
)(createStore)(
    optimist(combineReducers(reducers)), {},
    window.devToolsExtension && window.devToolsExtension()
);

s1(store);

wx.config(window.js_params);
wx.error(function (res) {
    PopupHelper.toast('当前版本暂不支持发布和分享功能！');
});
wx.ready(()=>{
    wx.hideMenuItems({
        menuList: [
            'menuItem:share:qq',
            'menuItem:share:weiboApp',
            'menuItem:share:facebook',
            'menuItem:share:QZone',
            'menuItem:copyUrl',
            'menuItem:openWithSafari'
        ]
    });
    wx.showMenuItems({
        menuList: [
            'menuItem:share:timeline',
            'menuItem:share:appMessage'
        ]
    });
});
render(
    <Provider store={store}>
        <Router history={hashHistory} render={applyRouterMiddleware(useScroll())}>
            <Route path="/pub" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/Pub'))
                });
            }}/>
            <Route path="/post/:id" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/Post/index'))
                });
            }}/>
            <Route path="/comments/:id" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/Comments/index'))
                });
            }}/>
            <Route path="/notifications" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/Notifications/index'))
                });
            }}/>
            <Route path="/me_sub_list" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/UserList/MeSubList'))
                });
            }}/>
            <Route path="/like_list/:id" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/UserList/LikeList'))
                });
            }}/>
            <Route path="/read_list/:id" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/UserList/ReadList'))
                });
            }}/>
            <Route path="/edit_topic/:id" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/EditTopic/index'))
                });
            }}/>
            <Route path="/pub_topic" getComponent={(nextState, cb)=>{
                require.ensure([], (require)=>{
                    cb(null, require('./routes/EditTopic/index'))
                });
            }}/>
            <Route path="/" component={App} >
                <Route path="home" component={Home} />
                <Route path="home/:time" component={Home} />
                <Route path="detail/:id" getComponent={(nextState, cb)=>{
                    require.ensure([], (require)=>{
                        cb(null, require('./routes/Detail/index'))
                    });
                }}/>
                <Route path="topic/:id" getComponent={(nextState, cb)=>{
                    require.ensure([], (require)=>{
                        cb(null, require('./routes/Topic/index'))
                    });
                }} onEnter={()=>{
                    store.dispatch(createAction('clear_notifications')())
                }}/>
                <Redirect from="/me/notifications" to="home" />
                <IndexRedirect to="home" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
