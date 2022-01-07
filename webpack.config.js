const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    entry: './app.js',
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    output: {
        filename: 'app.js',
        path: path.join(__dirname, '/build'),
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
};