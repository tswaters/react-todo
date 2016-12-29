
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const cssLoader = ExtractTextPlugin.extract({
  fallbackLoader: 'style-loader',
  loader: 'css-loader?modules'
})

const plugins = require('./plugins')
const loaders = require('./loaders')
const common = require('./common')

module.exports = Object.assign({}, common, {
  name: 'front-end',
  entry: {
    todo: './src/client/index'
  },
  output: {
    path: './dist/public',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },
  module: {
    loaders: loaders.concat([
      {test: /\.ejs$/, loader: 'html-loader'},
      {test: /\.(css|less)$/, loader: cssLoader}
    ])
  },
  plugins: plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({resource}) => (/node_modules/).test(resource),
      filename: 'vendor.bundle.js'
    }),
    new HtmlWebpackPlugin({
      template: 'src/server/views/index.ejs',
      filename: '../server/views/index.ejs',
      minify: {
        collapseWhitespace: true
      }
    }),
    new ExtractTextPlugin('styles.css')
  ])
})
