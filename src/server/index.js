
/* eslint no-console: [0] */

import app from './app'

const {
  PORT
} = process.env

app.listen(PORT, () => console.log(`listening on ${PORT}`))
