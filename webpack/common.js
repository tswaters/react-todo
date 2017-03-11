
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      client: path.resolve('./src/client'),
      common: path.resolve('./src/common'),
      server: path.resolve('./src/server')
    },
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.less']
  }
}