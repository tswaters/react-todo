
/* eslint no-console: [0] */

import 'isomorphic-fetch'
import app from './app'
import {readJson} from 'fs-extra'
import {join} from 'path'

const PORT = process.env.PORT

readJson(join(__dirname, './stats.json'), (err, stats) => {
  if (err) { throw err }
  app.locals.stats = stats
  app.listen(PORT, () => console.log(`listening on ${PORT}`))
})
