
const config = require('./webpack')
const front = config(false)
const back = config(true)

module.exports = [front, back]
