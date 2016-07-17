var webpack = require('webpack');

var _  = require('underscore');
var config = require('./webpack.config.common');
var AssetsPlugin = require('assets-webpack-plugin');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = _.extend(config, {
    output: {
        path: './assets',
        filename: '[hash].main.min.js',
        chunkFilename: '[chunkHash].min.js',
        publicPath: '/assets/'
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new ExtractTextPlugin("[hash].[name].css"),
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 2}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.AggressiveMergingPlugin({
            moveToParents: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new AssetsPlugin({
            path: path.join(__dirname, 'front_end', 'templates')
        })
    ]
});
