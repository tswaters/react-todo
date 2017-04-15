/* eslint-disable react/jsx-no-bind */
import React from 'react'
import {render} from 'react-dom'

import {Provider} from 'react-intl-redux'
import createHistory from 'history/createBrowserHistory'
import {ConnectedRouter} from 'react-router-redux'
import {preload} from 'react-router-server'

import configureStore from 'common/store'
import App from 'common/App'

import 'common/styles/base'

const history = createHistory()
const store = configureStore(history, window.LOCALS)

const app = (
  <Provider store={store}>
    <ConnectedRouter history={history} context={{}}>
      <App />
    </ConnectedRouter>
  </Provider>
)

preload(window.MODULES).then(() => {
  render(app, document.getElementById('root'))
})
