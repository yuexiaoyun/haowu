var webpack = require('webpack');

var _  = require('underscore');
var config = require('./webpack.config.common');

module.exports = _.extend(config, {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
    ]
});
