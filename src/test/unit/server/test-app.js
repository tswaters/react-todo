
import express, {Router} from 'express'
import session from 'express-session'
import {json} from 'body-parser'
import errors from 'server/middleware/errors'
import logger from 'server/middleware/logger'

export default () => {
  const context = new Router()
  const app = express()
  app.use(json())
  app.use(session({
    secret: 'magically',
    resave: false,
    saveUninitialized: false
  }))

  app.use(logger({level: 'silent'}))
  app.use(context)
  app.get('/tests/clear-session', (req, res) => {
    req.session.destroy()
    res.send('ok')
  })
  app.use(errors)
  return {app, context}
}
