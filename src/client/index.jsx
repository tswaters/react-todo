
import React from 'react'
import {render} from 'react-dom'

import {Provider} from 'react-redux'
import {match, Router, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import configureStore from 'common/store'
import routes from 'common/routes'

const store = configureStore(browserHistory, window.LOCALS)
const history = syncHistoryWithStore(browserHistory, store)

match({history, routes}, (err, redirectLocation, renderProps) => {
  if (err) { throw err }
  render(
    <Provider store={store}>
      <Router {...renderProps} />
    </Provider>,
    document.getElementById('root')
  )
})
