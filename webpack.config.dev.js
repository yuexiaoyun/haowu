var webpack = require('webpack');

var _  = require('underscore');
var config = require('./webpack.config.common');

config = _.extend(config, {
    output: {
        path: '/',
        filename: 'main.js',
        publicPath: '/assets/'
    },
    devtool: '#cheap-module-eval-source-map'
});
module.exports = config;
