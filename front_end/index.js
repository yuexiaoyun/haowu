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
