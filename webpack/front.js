
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')

const cssLoader = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: 'css-loader?modules!less-loader?relativeUrls&noIeCompat'
})

const plugins = require('./plugins')
const loaders = require('./loaders')
const common = require('./common')

module.exports = Object.assign({}, common, {
  name: 'front-end',
  entry: {
    app: './src/client/index'
  },
  output: {
    path: path.resolve('./dist/public'),
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
      favicon: 'src/client/favicon.ico',
      minify: {
        collapseWhitespace: true
      }
    }),
    new ExtractTextPlugin({filename: 'styles.css', allChunks: true}),
    new StatsPlugin('../server/stats.json', {
      chunkModules: true,
      exclude: [/^\.\/~/]
    })
  ])
})
