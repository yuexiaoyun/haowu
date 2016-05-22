require('es6-promise').polyfill();
require('whatwg-fetch');

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'

import App from './routes/App'
import Pub from './routes/Pub'
import Home from './routes/Home'
import Post from './routes/Post'
import Me from './routes/Me'

try {
    hashHistory.replace(window.location.pathname.substring(4));
    render(
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <Route path="home" component={Home} />
                <Route path="pub" component={Pub} />
                <Route path="me" component={Me} />
                <Route path="post/:id" component={Post} />
            </Route>
        </Router>,
        document.getElementById('app')
    );
} catch(err) {
    alert(err);
}

wx.error(function (res) {
    alert(res.errMsg);
});
