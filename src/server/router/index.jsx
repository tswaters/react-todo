
import React from 'react'
import {Provider} from 'react-intl-redux'
import {StaticRouter} from 'react-router'
import {ConnectedRouter} from 'react-router-redux'
import {createMemoryHistory} from 'history'
import {renderToString, extractModules} from 'react-router-server'
import {Helmet} from 'react-helmet'

import authentication from 'server/middleware/authentication'
import App from 'common/App'
import {errorRequest, infoRequest} from 'common/redux/api'

import configureStore from 'common/store'

export default [
  authentication(false),
  (req, res) => {

    req.app.locals.logger.info(`rendering ${req.path}`)

    const {user} = res.locals
    if (user) { delete user.roles }

    const history = createMemoryHistory({initialEntries: [req.path]})
    const store = configureStore(history, {user})

    // If erorrs encountered during a render they will show here
    // Make sure to display these message to the user.
    const error = req.flash('error').pop()
    if (error) { store.dispatch(errorRequest(error)) }

    const info = req.flash('info').pop()
    if (info) { store.dispatch(infoRequest(info)) }

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
      .then(({html, modules, state: serverState}) => {
        if (context.error) {
          req.flash('error', context.error)
          req.app.logger.error(context.error)
        }
        if (context.status) {
          res.status(context.status)
        }
        if (context.url) {
          // If we have flash, ensure sesion is saved prior to redirect
          return req.session.save(() => res.redirect(context.url))
        }

        const helmet = Helmet.renderStatic()
        res.render('index', {
          body: html,
          state: store.getState(),
          serverState,
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
