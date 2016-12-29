
/* eslint camelcase: 0 */

const webpack = require('webpack')

const front = require('./webpack/front')
const back = require('./webpack/back')

front.plugins.push(
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true
    },
    output: {
      comments: false
    }
  })
)

module.exports = [front, back]
