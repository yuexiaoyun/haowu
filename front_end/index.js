require('es6-promise').polyfill();
require('whatwg-fetch');
window.onerror = alert;

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { createAction } from 'redux-actions';

import App from './routes/App'
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
if (entry == '/notification') {
    hashHistory.replace('/home');
    store.dispatch(createAction('current_tab')(1));
    store.dispatch(createAction('current_myself_tab')(1));
} else {
    hashHistory.replace(entry);
}

render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/detail/:id" component={Detail} />
            <Route path="/pub" component={Pub} />
            <Route path="/post/:id" component={Post} />
            <Route path="/home" component={App} />
            <Route path="/sub_list" component={SubList} />
        </Router>
    </Provider>,
    document.getElementById('app')
);

wx.error(function (res) {
    PopupHelper.toast(res.errMsg);
});
