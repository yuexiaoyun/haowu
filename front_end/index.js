require('es6-promise').polyfill();
require('whatwg-fetch');

import React from 'react';
import { render, findDOMNode } from 'react-dom';
import Pub from './routes/Pub'

try {
    render((
        <Pub />
    ), document.getElementById('app'));
} catch(err) {
    alert(err);
}

wx.error(function (res) {
    alert(res.errMsg);
});
