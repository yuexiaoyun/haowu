require('es6-promise').polyfill();
require('whatwg-fetch');

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'

import App from './routes/App'
import Pub from './routes/Pub'
import Post from './routes/Post'

try {
    render(
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <Route path="pub" component={Pub} />
                <Route path="post/:id" component={Post} />
            </Route>
        </Router>,
        document.getElementById('app')
    );
} catch(err) {
    alert(err);
}

hashHistory.replace('pub');

wx.error(function (res) {
    alert(res.errMsg);
});
