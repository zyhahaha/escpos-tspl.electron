const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

const commonConfig = {
    target: "node",
    mode: "production",
    module: {
        rules: [
            // {
            //     test: /\.ts?$/,
            //     use: 'ts-loader',
            //     exclude: /node_modules/,
            // },
            {
                test: /\.node$/,
                loader: 'node-loader'
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.node'],
    },
    externals: nodeExternals(),
}

module.exports = [
    Object.assign({}, commonConfig, {
        target: 'electron-main',
        entry: {
            "index": path.resolve(__dirname, 'index.js')
        },
        output: {
            path: path.resolve(__dirname, "./dist"),
            library: "nodePrinter",
            filename: "[name].js",
            libraryTarget: "umd",
            umdNamedDefine: true,
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
        },
        plugins: [
            // new BundleDeclarationsWebpackPlugin(),
        ],

    }),
];