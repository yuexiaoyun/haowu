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
    },
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
};
