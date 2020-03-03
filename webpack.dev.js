const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const mergedClientConfig = merge(common.clientConfig, {
    devtool: 'inline-source-map',
    plugins: [
        //new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
});

const mergedServerConfig = merge(common.serverConfig, {
    devtool: 'inline-source-map'
});

module.exports = [mergedClientConfig, mergedServerConfig];
