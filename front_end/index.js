require('es6-promise').polyfill();
require('whatwg-fetch');
window.onerror = alert;

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { applyRouterMiddleware, Router, Route, Link, hashHistory } from 'react-router'
import useScroll from 'react-router-scroll';
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { createAction } from 'redux-actions';

import App from './routes/App'
import Home from './routes/Home'
import Me from './routes/Me'
import MyPosts from './routes/MyPosts'
import Notifications from './routes/Notifications'
import Pub from './routes/Pub'
import Detail from './routes/Detail'
import Post from './routes/Post'
import SubList from './routes/SubList'
import PopupHelper from './utility/PopupHelper'
import * as reducers from './reducers'
import { setStore } from './utility/update'

let store = createStore(combineReducers(reducers));
setStore(store);
var entry = window.location.pathname.substring(4);
if (entry.substring(0, 5) == '/post') {
    hashHistory.replace('/home');
    setTimeout(()=>hashHistory.push(entry), 0);
} else {
    hashHistory.replace(entry);
    entry = null;
}

// TODO useScroll貌似没解决滚动条的问题
render(
    <Provider store={store}>
        <Router history={hashHistory} render={applyRouterMiddleware(useScroll)}>
            <Route path="/detail/:id" component={Detail} />
            <Route path="/pub" component={Pub} />
            <Route path="/post/:id" component={Post} />
            <Route path="/sub_list" component={SubList} />
            <Route path="/" component={App} >
                <Route path="home" ref='home' component={Home} />
                <Route path="me" component={Me} >
                    <Route path="posts" component={MyPosts} />
                    <Route path="notifications" component={Notifications} />
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);

wx.error(function (res) {
    PopupHelper.toast(res.errMsg);
});
