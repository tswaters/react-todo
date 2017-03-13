
/* eslint no-console: [0] */

import 'isomorphic-fetch'
import app from './app'

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`listening on ${PORT}`))
