
/* eslint no-console: [0] */

import app from './app'

import config from '../../config.json'

app.listen(config.port, () => console.log(`listening on ${config.port}`))
