
/* eslint no-console: [0] */

import 'source-map-support/register'
import 'isomorphic-fetch'
import app from 'server/app'

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`listening on ${PORT}`))
