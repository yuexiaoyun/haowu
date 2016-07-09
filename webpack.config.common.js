var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './front_end/index.js',
    output: {
        path: './static/scripts/',
        filename: '[hash].main.min.js',
        chunkFilename: '[chunkHash].min.js',
        publicPath: '/static/scripts/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.less$/,
            loader: "style!css!less"
        }, {
            test: /\.css$/,
            loaders: [
                'style?sourceMap',
                'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
            ]
        }, {
            test: /\.png$|\.jpg$/,
            loader: "base64-image"
        }]
    },
    plugins: [new AssetsPlugin({
        path: path.join(__dirname, 'front_end', 'templates')
    })]
};
