
import {join} from 'path'
import express from 'express'
import session from 'express-session'
import {json} from 'body-parser'

import {errors} from './lib/middleware'
import api from './lib/api'
import router from './lib/router.jsx'

const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, '../public')))
app.use(json())
app.use(session({
  secret: 'magically',
  resave: false,
  saveUninitialized: false
}))
app.use('/api', api)
app.use(router)
app.use(errors)

export default app
