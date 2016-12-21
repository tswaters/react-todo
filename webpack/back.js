
const webpackNodeExternals = require('webpack-node-externals')
const externals = [webpackNodeExternals()]

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
      {test: /\.(css|less)$/, loader: 'css/locals?module'}
    ])
  },
  output: {
    path: './dist/server',
    filename: 'index.js'
  },
  externals
})
