require('es6-promise').polyfill();
require('whatwg-fetch');
window.onerror = alert;

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import App from './routes/App'
import Pub from './routes/Pub'
import Detail from './routes/Detail'
import SubList from './routes/SubList'

import * as reducers from './reducers'
import PopupHelper from './utility/PopupHelper'

let store = createStore(combineReducers(reducers));

hashHistory.replace(window.location.pathname.substring(4));
render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/detail/:id" component={Detail} />
            <Route path="/pub" component={Pub} />
            <Route path="/home" component={App} />
            <Route path="/sub_list" component={SubList} />
        </Router>
    </Provider>,
    document.getElementById('app')
);

wx.error(function (res) {
    PopupHelper.toast(res.errMsg);
});
