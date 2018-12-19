
import React from 'react'
import {renderToString} from 'react-dom/server'
import {renderRoutes} from 'react-router-config'
import {Provider} from 'react-redux'
import {IntlProvider} from 'react-intl-redux'
import {ConnectedRouter} from 'connected-react-router'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {Helmet} from 'react-helmet'

import authentication from 'server/middleware/authentication'
import {errorRequest, infoRequest} from 'common/redux/api'
import {addMessages} from 'common/redux/intl'
import configureStore from 'common/store'
import {loadRoutes, loadActions, getRoute} from 'common/routes/helpers'
import localization from 'server/middleware/localization'

export default [
  localization,
  authentication(false),
  async (req, res) => {
    try {

      req.app.locals.logger.info(`rendering ${req.path}`)

      const {user} = res.locals
      const {routes, messages} = req.app.locals

      if (user) { delete user.roles }

      const history = createMemoryHistory({initialEntries: [req.path]})
      const store = configureStore(history, {user})

      store.dispatch(addMessages(req.locale, messages[req.locale]))
      await loadRoutes(routes, req.path)

      const route = getRoute(routes, req.path)
      try {
        await Promise.all(loadActions(routes, req.path).map(action => store.dispatch(action(route))))
      } catch (err) {
        if (err.status === 401) {
          return res.redirect(`/auth/login?from=${encodeURIComponent(req.path)}`)
        }
        throw err
      }

      const error = req.flash('error').pop()
      if (error) { store.dispatch(errorRequest(error)) }

      const info = req.flash('info').pop()
      if (info) { store.dispatch(infoRequest(info)) }

      const context = {}

      const app = (
        <Provider store={store}>
          <IntlProvider locale={req.locale}>
            <ConnectedRouter history={history}>
              <Router history={history} context={context}>
                {renderRoutes(routes, {loaded: true})}
              </Router>
            </ConnectedRouter>
          </IntlProvider>
        </Provider>
      )

      const body = renderToString(app)

      if (context.status) {
        res.status(context.status)
      }

      if (context.error) {
        throw context.error
      }

      if (context.url) {
        return res.redirect(context.url)
      }

      res.render('index', {
        body,
        state: store.getState(),
        helmet: Helmet.renderStatic()
      })

    } catch (err) {

      req.app.locals.logger.error({err})
      req.flash('error', {message: err.message, stack: err.stack})
      req.session.save(() => res.status(500).redirect('/error'))

    }
  }
]
