
import React from 'react'
import {Provider} from 'react-redux'
import {createMemoryHistory, match, RouterContext} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {renderToString} from 'react-dom/server'

import {authentication, storeInit, storeList, storeUser} from 'server/lib/middleware'
import routes from 'common/routes'
import configureStore from 'common/store'

export default [
  authentication(false),
  storeInit(),
  storeUser(),
  storeList(),
  (req, res) => {
    const memoryHistory = createMemoryHistory(req.url)
    const store = configureStore(memoryHistory, res.locals.state || {})
    const history = syncHistoryWithStore(memoryHistory, store)

    match({history, routes, location: req.url}, (err, redirect, renderProps) => {
      if (err) {
        throw err
      }

      if (redirect) {
        return res.redirect(redirect.pathname + redirect.search)
      }

      const state = store.getState()
      const body = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      return res.render('index', {body, state})
    })
  }
]
