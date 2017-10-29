
import {join} from 'path'
import express from 'express'
import session from 'express-session'
import redisStore from 'connect-redis'
import {json} from 'body-parser'
import flash from 'connect-flash'

import errors from './middleware/errors'
import api from './api'
import router from './router.jsx'

const {REDIS_HOST, REDIS_PORT, REDIS_SESSION_DB} = process.env

process.on('unhandledRejection', r => console.log('unhandledRejection', r))

process.on('uncaughtException', r => console.log('unhandledException', r))

const SessionStore = redisStore(session)

const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, '../client')))
app.use(json())
app.use(session({
  store: new SessionStore({
    host: REDIS_HOST,
    port: REDIS_PORT,
    db: parseInt(REDIS_SESSION_DB, 10)
  }),
  secret: 'magically',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use('/api', api)
app.use(router)
app.use(errors)

export default app
