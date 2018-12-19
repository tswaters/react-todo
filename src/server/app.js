
import {join} from 'path'
import express from 'express'
import session from 'express-session'
import redisStore from 'connect-redis'
import {json} from 'body-parser'
import flash from 'connect-flash'

import log from 'server/logger'
import errors from 'server/middleware/errors'
import logger from 'server/middleware/logger'
import api from 'server/api'
import router from 'server/router/index'
import routes from 'common/routes'

import en from 'i18n/en'

import 'server/models'

const {REDIS_HOST, REDIS_PORT, REDIS_SESSION_DB} = process.env

process.on('unhandledRejection', /*istanbul ignore next*/ r => log.error('unhandledRejection', r))

process.on('uncaughtException', /*istanbul ignore next*/ r => log.error('unhandledException', r))

const SessionStore = redisStore(session)

const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, '../client'), {
  maxAge: Infinity
}))
app.use(json())
app.use(session({
  store: new SessionStore({
    host: REDIS_HOST,
    port: REDIS_PORT,
    db: parseInt(REDIS_SESSION_DB, 10)
  }),
  secret: 'magically',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(logger())
app.use('/api', api)
app.use(router)
app.use(errors)

app.locals.messages = {en}
app.locals.routes = routes

export default app
