
import React from 'react'
import {Provider} from 'react-intl-redux'
import {StaticRouter} from 'react-router'
import {ConnectedRouter} from 'react-router-redux'
import createMemoryHistory from 'history/createMemoryHistory'
import {renderToString, extractModules} from 'react-router-server'

import localization from './middleware/localization'
import authentication from './middleware/authentication'
import App from 'common/App'

import configureStore from 'common/store'

export default [
  localization(),
  authentication(false),
  (req, res) => {
    const {user, intl} = res.locals
    if (user) { delete user.roles }

    const history = createMemoryHistory(req.url)
    const store = configureStore(history, {intl, user})

    const app = (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <StaticRouter location={req.url} context={store.getState()}>
            <App />
          </StaticRouter>
        </ConnectedRouter>
      </Provider>
    )

    renderToString(app).then(({html, modules}) => {
      res.render('index', {
        body: html,
        state: store.getState(),
        modules: extractModules(modules, res.app.locals.stats)
      })
    })
  }
]
