require('es6-promise').polyfill();
require('whatwg-fetch');

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './routes/App'
import Pub from './routes/Pub'
import Detail from './routes/Detail'

import reducers from './reducers'
import PopupHelper from './utility/PopupHelper'

let store = createStore(reducers);

try {
    hashHistory.replace(window.location.pathname.substring(4));
    render(
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/detail/:id" component={Detail} />
                <Route path="/pub" component={Pub} />
                <Route path="/home" component={App} />
            </Router>
        </Provider>,
        document.getElementById('app')
    );
} catch(err) {
    alert(err);
}

wx.error(function (res) {
    PopupHelper.toast(err.errMsg);
});
