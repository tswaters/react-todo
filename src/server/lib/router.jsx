
import React from 'react'
import {Provider} from 'react-intl-redux'
import {createMemoryHistory, match, RouterContext} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {renderToString} from 'react-dom/server'

import localization from 'server/lib/middleware/localization'
import authentication from 'server/lib/middleware/authentication'
import storeInit from 'server/lib/middleware/store-init'
import storeList from 'server/lib/middleware/store-list'
import storeUser from 'server/lib/middleware/store-user'

import routes from 'common/routes'
import configureStore from 'common/store'

export default [
  authentication(false),
  storeInit(),
  localization(),
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
