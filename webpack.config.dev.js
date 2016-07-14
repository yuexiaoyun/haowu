var webpack = require('webpack');

var _  = require('underscore');
var config = require('./webpack.config.common');
var AssetsPlugin = require('assets-webpack-plugin');
var path = require('path');

config = _.extend(config, {
    output: {
        path: './assets',
        filename: '[hash].main.js',
        chunkFilename: '[chunkHash].js',
        publicPath: '/assets/'
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new AssetsPlugin({
            path: path.join(__dirname, 'front_end', 'templates')
        })
    ]
});
module.exports = config;
