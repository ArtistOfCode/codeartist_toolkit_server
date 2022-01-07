const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const PkgWebpackPlugin = require('./plugin/pkg-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    output: {
        filename: 'app.js',
        path: path.join(__dirname, '/build'),
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{ loader: 'ts-loader', options: { configFile: path.resolve(__dirname, './tsconfig.json'), }, },],
                exclude: /node_modules/,
            },
        ]
    },
    performance: {
        assetFilter: (filename) => filename.endsWith('.ts'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({ patterns: [{ from: path.join(__dirname, '/lib'), to: path.join(__dirname, '/build/win/lib') }] }),
        new PkgWebpackPlugin(),
    ]
};