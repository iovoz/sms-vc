const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const clientConfig = {
    entry: {
        'public/js/components/smsvc-bundle.js': './client/js/containers/SMSVC-client.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),

        new CopyWebpackPlugin([
            {
                context: './public/',
                from: '**/*',
                to: './public'
            }
        ], { /* options */ }),

        new ExtractTextPlugin("public/css/vendor-bundle.css"),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'public/js/components/vendor-bundle.js',
            chunks: [
                'public/js/components/smsvc-bundle.js'
            ]
        })
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]'
    },

    resolve: {
        alias: {
            beyondcarsConstants$: path.resolve(__dirname, 'client', 'js', 'constants', isProduction ? 'production.js' : 'development.js')
        }
    },

    module: {
        rules: [
            {
                test: require.resolve('moment'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'moment'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['env', 'stage-2', 'react']
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'public/css/[name].css'
                        }
                    },
                    {
                        loader: 'extract-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // If you are having trouble with urls not resolving add this setting.
                            // See https://github.com/webpack-contrib/css-loader#url
                            // url: false,
                            minimize: isProduction,
                            // sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: isProduction
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'public/images/',
                            useRelativePath: true
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: './public/css/fonts',
                            publicPath: './fonts'
                        }
                    }
                ]
            }
        ]
    }
};

const serverConfig = {
    target: 'node',
    node: {
        __dirname: false,  // The regular Node.js __dirname behavior. The dirname of the output file when run in a Node.js environment.
        __filename: false,  // The regular Node.js __filename behavior. The filename of the output file when run in a Node.js environment.
    },
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    entry: {
        app: './app.js',
        'temp/styles': './server/sass/sassLoader.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
        // new CleanWebpackPlugin(['dist']),  // done by clientConfig already
        new ExtractTextPlugin({
            filename: 'public/css/[name].css',
        }),
        new CopyWebpackPlugin([
            {
                context: './server/',
                from: '**/*',
                to: './server',
                ignore: ['controllers/**', 'sass/**']
            },
            {
                context: './locales/',
                from: '**/*',
                to: './locales'
            },
            {
                context: './public',
                from: '**/*.txt',
                to: './public'
            }
        ], { /* options */ }),
    ],

    resolve: {
        alias: {
            beyondcarsConstants$: path.resolve(__dirname, 'client', 'js', 'constants', isProduction ? 'production.js' : 'development.js')
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['env', 'stage-2', 'react']
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'public/css/[name].css'
                        }
                    },
                    {
                        loader: 'extract-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // If you are having trouble with urls not resolving add this setting.
                            // See https://github.com/webpack-contrib/css-loader#url
                            // url: false,
                            minimize: isProduction,
                            // sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.css$/,
                // cannot use style-loader which inserts <style></style> tags to DOM which doesn't work on server-side
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                // If you are having trouble with urls not resolving add this setting.
                                // See https://github.com/webpack-contrib/css-loader#url
                                // url: false,
                                minimize: isProduction,
                                // sourceMap: true
                            }
                        },
                    ]
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            useRelativePath: true,
                            emitFile: false
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = {
    clientConfig: clientConfig,
    serverConfig: serverConfig
};
