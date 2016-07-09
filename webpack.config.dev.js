var webpack = require('webpack');

var _  = require('underscore');
var config = require('./webpack.config.common');

module.exports = _.extend(config, {
    devtool: '#cheap-module-eval-source-map'
});
