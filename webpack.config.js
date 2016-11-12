
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackNodeExternals = require('webpack-node-externals')

const externals = [webpackNodeExternals()]
const cssLoader = ExtractTextPlugin.extract('style-loader', 'css?modules')

const commonLoaders = [
  {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
  {test: /\.json$/, loader: 'json-loader'}
]

const back = {
  debug: true,
  name: 'back-end',
  target: 'node',
  entry: './src/server/index.js',
  node: {
    __dirname: false
  },
  module: {
    loaders: commonLoaders.concat([
      {test: /\.(css|less)$/, loader: 'css/locals?module'}
    ])
  },
  output: {
    path: './dist/server',
    filename: 'index.js'
  },
  externals
}

const front = {
  debug: true,
  name: 'front-end',
  entry: {
    todo: './src/assets/index.jsx'
  },
  output: {
    path: './dist/public',
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: commonLoaders.concat([
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
}

module.exports = [
  front,
  back
]
