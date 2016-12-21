
const nodeExternals = require('webpack-node-externals')
const common = require('./common')
const loaders = require('./loaders')

module.exports = Object.assign({}, common, {
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    loaders: loaders.concat([
      {test: /\.(css|less)$/, loader: 'css/locals?module'}
    ])
  },
  devtool: 'cheap-module-source-map'
})
