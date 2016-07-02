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
import optimistPromiseMiddleware from 'redux-optimist-promise';
import wx from 'weixin-js-sdk';

import App from './routes/App'
import Home from './routes/Home'
import Notifications from './routes/Notifications/index'
import Pub from './routes/Pub'
import Detail from './routes/Detail/index'
import Post from './routes/Post/index'

import SubList from './routes/UserList/SubList'
import MeSubList from './routes/UserList/MeSubList'
import LikeList from './routes/UserList/LikeList'
import ReadList from './routes/UserList/ReadList'

import PopupHelper from './utility/PopupHelper'
import * as reducers from './reducers'
import { setStore as s1 } from './utility/update'
import { setStore as s2 } from './utility/audio_manager'

import './utility/set_title'
import './less/sm.less'

if (process.env.NODE_ENV != 'production') {
    console.log('in development');
    window.onerror = alert;
}

let store = (applyMiddleware(
    optimistPromiseMiddleware()
)(createStore))(optimist(combineReducers(reducers)), {},
    window.devToolsExtension && window.devToolsExtension());
s1(store);
s2(store);

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
            <Route path="/pub" component={Pub} />
            <Route path="/post/:id" component={Post} />
            <Route path="/sub_list" component={SubList} />
            <Route path="/me_sub_list" component={MeSubList} />
            <Route path="/like_list/:id" component={LikeList} />
            <Route path="/read_list/:id" component={ReadList} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/" component={App} >
                <Route path="home" component={Home} />
                <Route path="home/:time" component={Home} />
                <Route path="detail/:id" component={Detail} />
                <Redirect from="/me/notifications" to="home" />
                <IndexRedirect to="home" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
