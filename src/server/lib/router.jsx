
import React from 'react'
import {Provider} from 'react-intl-redux'
import {createMemoryHistory, match} from 'react-router'
import {ReduxAsyncConnect, loadOnServer} from 'redux-connect'
import {syncHistoryWithStore} from 'react-router-redux'
import {renderToString} from 'react-dom/server'

import localization from './middleware/localization'
import authentication from './middleware/authentication'

import routes from 'common/routes'
import configureStore from 'common/store'

export default [
  localization(),
  authentication(false),
  (req, res, next) => {
    const {user, intl} = res.locals
    if (user) { delete user.roles }

    const memoryHistory = createMemoryHistory(req.url)
    const store = configureStore(memoryHistory, {intl, user})
    const history = syncHistoryWithStore(memoryHistory, store)

    match({history, routes, location: req.url}, (matchErr, redirect, renderProps) => {
      if (matchErr) { return next(matchErr) }

      if (redirect) {
        return res.redirect(redirect.pathname + redirect.search)
      }

      loadOnServer({...renderProps, store}).then(() => {
        const state = store.getState()
        const {loadState} = state.reduxAsyncConnect

        const error = Object.keys(loadState).reduce((memo, key) => memo || loadState[key].error, null)
        if (error) { throw error }

        const body = renderToString(
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        )
        return res.render('index', {body, state})
      })
      .catch(err => next(err))
    })
  }
]
