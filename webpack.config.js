
const config = require('./webpack')

module.exports = [
  config(true),
  config(false)
]
