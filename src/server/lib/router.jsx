
import React from 'react'
import {Provider} from 'react-intl-redux'
import {StaticRouter} from 'react-router'
import {ConnectedRouter} from 'react-router-redux'
import createMemoryHistory from 'history/createMemoryHistory'
import {renderToString, extractModules} from 'react-router-server'

import localization from './middleware/localization'
import authentication from './middleware/authentication'
import App from 'common/App'
import {errorRequest} from 'common/redux/api'

import configureStore from 'common/store'

export default [
  localization(),
  authentication(false),
  (req, res) => {
    const {user, intl} = res.locals
    if (user) { delete user.roles }

    const history = createMemoryHistory(req.url)
    const store = configureStore(history, {intl, user})

    // If erorrs encountered during a render they will show here
    // Make sure to display these message to the user.
    const error = req.flash('error').pop()
    if (error) { store.dispatch(errorRequest(error)) }

    const context = {}
    const app = (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </ConnectedRouter>
      </Provider>
    )

    renderToString(app)
      .then(({html, modules}) => {
        if (context.error) {
          req.flash('error', context.error)
        }
        if (context.status) {
          res.status(context.status)
        }
        if (context.url) {
          return res.redirect(context.url)
        }

        const helmet = Helmet.renderStatic()
        res.render('index', {
          body: html,
          state: store.getState(),
          modules: extractModules(modules, res.app.locals.stats),
          helmet
        })
      })
      .catch(err => {
        req.flash('error', {message: err.message, stack: err.stack})
        req.session.save(() => res.status(500).redirect('/error'))
      })
  }
]
