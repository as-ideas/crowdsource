const webpack = require('webpack');
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

var _root = path.resolve(__dirname, '..');

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

module.exports = (env) => {
    let webPackConfig = {
        mode: 'development',
        entry: {
            app: './src/main/index.js',
            vendor: ['react', 'react-dom']
        },
        output: {
            path: path.join(__dirname, './target/classes/public'),
            filename: '[name].bundle.js',
        },
        module: {
            rules: [
                {test: /\.html$/, exclude: /node_modules/, use: {loader: 'file-loader', query: {name: '[name].[ext]'},},},
                {test: /\.css$/, exclude: /node_modules/, use: ['style-loader', 'css-loader']},
                {test: /\.scss$/, exclude: /node_modules/, use: ['style-loader', 'css-loader', 'sass-loader']},
                {test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'],},
                {
                    test: /\.(png|jpe?g|gif|svg|ico|woff|woff2|ttf|eot)$/, loader: 'file-loader', options: {
                        name: '[path][name].[ext]?[hash]',
                        context: './src/',
                        outputPath: 'images/'
                    }
                },

            ],
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [
                path.resolve(__dirname, 'node_modules'),
                path.join(__dirname, './src')
            ]
        },
        plugins: [
            new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: root('./target/classes/public')}),
            // new CopyWebpackPlugin([{from: './static/', to: ''}])
        ],
        devServer: {
            historyApiFallback: true
        },
        node: {
            console: true,
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        }
    };

    if (env && env.prod) {
        webPackConfig.mode = 'production';
        webPackConfig.plugins.push(
            new DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            })
        );
    }

    return webPackConfig;
};