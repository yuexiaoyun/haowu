var webpack = require('webpack');

module.exports = {
    entry: './front_end/index.js',
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
    }
};