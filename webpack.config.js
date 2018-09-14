const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: [
      '.js', '.jsx',
    ],
    alias: {
      src: path.resolve('src'),
      components: path.resolve('src/components'),
      views: path.resolve('src/views'),
      styles: path.resolve('src/styles'),
      assets: path.resolve('src/assets'),
      general: path.resolve('src/general'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {loader: 'css-loader', options: {
              modules: true,
              sourceMap: true,
              minimize: true,
              discardComments: {
                removeAll: true
              },
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"}
            },
            {
              loader: "postcss-loader",
              options: {
                modules: true,
                sourceMap: true,
                minimize: true,
                discardComments: {
                  removeAll: true
                }
              }
            }
          ]
        })
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: true,
                discardComments: {
                  removeAll: true
                }
              },
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      }, {
        test: /\.(jsx|js)$/,
        use: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      }, {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: ['file-loader?name=images/[name].[ext]', 'image-webpack-loader'],
      }, {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
            }
        }]
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  cache: true,
  devtool: 'source-map',
  plugins: !isProduction
    ? [
      new HtmlWebpackPlugin({
        title: 'ebuyexhange',
        minify: {
          collapseWhitespace: isProduction,
        },
        hash: false,
        template: './src/index.html',
      }),
      new ExtractTextPlugin({
        filename: 'app.css',
        allChunks: true,
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.DefinePlugin({
        ARG_API_URL: JSON.stringify(process.env.API_URL || "http://localhost:1337"),
      }),
    ]
    : [
      new HtmlWebpackPlugin({
        title: 'ebuyexhange',
        minify: {
          collapseWhitespace: isProduction,
        },
        hash: false,
        template: './src/index.html',
      }),
      new ExtractTextPlugin({
        filename: 'app.css',
        disable: !isProduction,
        allChunks: true,
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.DefinePlugin({
        ARG_API_URL: JSON.stringify(process.env.API_URL || "http://localhost:1337"),
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true,
        },
        output: {
          comments: false,
        },
      }),
    ],
};
