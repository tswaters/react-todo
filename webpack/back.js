
const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const externals = [webpackNodeExternals()]

const plugins = require('./plugins')
const loaders = require('./loaders')
const common = require('./common')

module.exports = Object.assign({}, common, {
  name: 'back-end',
  target: 'node',
  entry: './src/server/index.js',
  node: {
    __dirname: false
  },
  module: {
    loaders: loaders.concat([
      {test: /\.(css|less)$/, loader: 'css-loader/locals?module'}
    ])
  },
  plugins,
  output: {
    path: './dist/server',
    filename: 'index.js'
  },
  externals
})
