
import {join} from 'path'
import express from 'express'

import React from 'react'
import {Provider} from 'react-redux'
import {createMemoryHistory, match, RouterContext} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {renderToString} from 'react-dom/server'

import routes from '../common/routes'
import configureStore from '../common/store'

const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, '../public')))

app.use((req, res) => {
  const memoryHistory = createMemoryHistory(req.url)
  const store = configureStore(memoryHistory)
  const history = syncHistoryWithStore(memoryHistory, store)

  match({history, routes, location: req.url}, (err, redirect, renderProps) => {
    if (err) {
      throw err
    }

    if (redirect) {
      return res.redirect(redirect.pathname + redirect.search)
    }

    const page = (
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    )

    const state = store.getState()
    const body = renderToString(page)

    return res.render('index', {body, state})
  })
})

export default app
