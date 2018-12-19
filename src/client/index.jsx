/* eslint-disable react/jsx-no-bind */
import React from 'react'
import {hydrate} from 'react-dom'

import {renderRoutes} from 'react-router-config'
import {Provider} from 'react-intl-redux'
import createHistory from 'history/createBrowserHistory'
import {ConnectedRouter} from 'connected-react-router'
import {Router} from 'react-router-dom'

import routes from 'common/routes'
import {loadRoutes} from 'common/routes/helpers'
import configureStore from 'common/store'

import 'common/styles/base'

const history = createHistory()
const store = configureStore(history, window.LOCALS)

loadRoutes(routes, location.pathname)
  .then(() => hydrate(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Router history={history}>
          {renderRoutes(routes, {loaded: true})}
        </Router>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  ))
