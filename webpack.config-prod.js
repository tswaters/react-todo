
const config = require('./webpack')
const front = config(false, true)
const back = config(true, true)

module.exports = [front, back]
