var webpack = require('webpack');

module.exports = {
    entry: './front_end/index.js',
    output: {
        path: './static/scripts/',
        filename: 'bundle.min.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.less$/,
            loader: "style!css!less"
        }]
    }
};
