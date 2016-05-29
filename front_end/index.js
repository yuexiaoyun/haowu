require('es6-promise').polyfill();
require('whatwg-fetch');

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './routes/App'
import Pub from './routes/Pub'
import Home from './routes/Home'
import Me from './routes/Me'

import reducers from './reducers'
import PopupHelper from './utility/PopupHelper'

let store = createStore(reducers);

try {
    hashHistory.replace(window.location.pathname.substring(4));
    render(
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <Route path="home" component={Home} />
                    <Route path="pub" component={Pub} />
                    <Route path="me" component={Me} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById('app')
    );
} catch(err) {
}

wx.error(function (res) {
    PopupHelper.toast(err.errMsg);
});
