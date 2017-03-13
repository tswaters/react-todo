/* eslint-disable react/jsx-no-bind */
import React from 'react'
import {render} from 'react-dom'

import {Provider} from 'react-intl-redux'
import {match, Router, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {ReduxAsyncConnect} from 'redux-connect'

import configureStore from 'common/store'
import routes from 'common/routes'

import 'common/styles/base'

const store = configureStore(browserHistory, window.LOCALS)
const history = syncHistoryWithStore(browserHistory, store)

match({history, routes}, (err, redirectLocation, renderProps) => {
  if (err) { throw err }
  render(
    <Provider store={store}>
      <Router
        {...renderProps}
        render={props => <ReduxAsyncConnect {...props} />}
      />
    </Provider>,
    document.getElementById('root')
  )
})
