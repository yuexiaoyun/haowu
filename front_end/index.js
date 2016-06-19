require('es6-promise').polyfill();
require('whatwg-fetch');
window.onerror = alert;

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { applyRouterMiddleware, Router, Route, Link, Redirect, IndexRedirect, hashHistory } from 'react-router'
import useScroll from 'react-router-scroll';
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createAction } from 'redux-actions';
import optimist from 'redux-optimist';
import optimistPromiseMiddleware from 'redux-optimist-promise';

import App from './routes/App'
import Home from './routes/Home'
import Me from './routes/Me'
import MyPosts from './routes/MyPosts'
import Notifications from './routes/Notifications'
import Pub from './routes/Pub'
import Detail from './routes/Detail'
import Post from './routes/Post'
import SubList from './routes/SubList'
import LikeList from './routes/LikeList'
import ReadList from './routes/ReadList'
import PopupHelper from './utility/PopupHelper'
import * as reducers from './reducers'
import { setStore as s1 } from './utility/update'
import { setStore as s2 } from './utility/audio_manager'

import './utility/set_title';

let store = (applyMiddleware(
    optimistPromiseMiddleware()
)(createStore))(optimist(combineReducers(reducers)), {},
    window.devToolsExtension && window.devToolsExtension());
s1(store);
s2(store);

// TODO 精简CSS
// TODO 各种出错处理，比如语音播放
// TODO 微信的JS打进bundle
// TODO 图片要根据屏幕宽度，做很多套适配的样式
// TODO 按钮的各种点击态
// TODO CssButton组件需要全局去掉

render(
    <Provider store={store}>
        <Router history={hashHistory} render={applyRouterMiddleware(useScroll())}>
            <Route path="/pub" component={Pub} />
            <Route path="/post/:id" component={Post} />
            <Route path="/post/:id/:new_id" component={Post} />
            <Route path="/sub_list" component={SubList} />
            <Route path="/like_list/:id" component={LikeList} />
            <Route path="/read_list/:id" component={ReadList} />
            <Route path="/" component={App} >
                <Route path="home" component={Home} />
                <Route path="home/:time" component={Home} />
                <Route path="me" component={Me} >
                    <Route path="posts" component={MyPosts} />
                    <Route path="notifications" component={Notifications} />
                </Route>
                <Redirect from={"detail/" + window.user_id} to="/me/posts" />
                <Route path="detail/:id" component={Detail} />
                <IndexRedirect to="home" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);

wx.error(function (res) {
    PopupHelper.toast('当前版本暂不支持发布和分享功能');
});
