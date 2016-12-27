
const path = require('path')

const Dotenv = require('dotenv-webpack')

module.exports = {
  debug: true,
  resolve: {
    alias: {
      client: path.resolve('./src/client'),
      common: path.resolve('./src/common'),
      server: path.resolve('./src/server')
    },
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.less']
  },
  plugins: [
    new Dotenv({
      path: `.env/${process.env.NODE_ENV}.env`
    })
  ]
}
