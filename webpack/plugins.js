
const webpack = require('webpack')

const {parseSync} = require('env-file-parser')
const obj = parseSync(`./.env/${process.env.NODE_ENV}.env`)
const vars = Object.keys(obj).reduce((memo, item) => {
  memo[`process.env.${item}`] = JSON.stringify(obj[item])
  return memo
}, {})

vars['process.env.BASE_URL'] = `"${obj.PROTOCOL}://${obj.HOST}:${obj.PORT}"`

module.exports = [
  new webpack.DefinePlugin(vars)
]

