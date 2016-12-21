
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssLoader = ExtractTextPlugin.extract('style-loader', 'css?modules')

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
    publicPath: '/'
  },
  module: {
    loaders: loaders.concat([
      {test: /\.ejs$/, loader: 'html'},
      {test: /\.(css|less)$/, loader: cssLoader}
    ])
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/server/views/index.ejs',
      filename: '../server/views/index.ejs',
      minify: {
        collapseWhitespace: true
      }
    }),
    new ExtractTextPlugin('styles.css')
  ]
})
