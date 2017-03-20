
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {routerReducer, routerMiddleware} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import {intlReducer} from 'react-intl-redux'
import createLogger from 'redux-logger'

import api from './redux/api'
import user from './redux/user'
import todo from './todo/redux'

export default (history, state) => {

  const middleware = [
    routerMiddleware(history),
    thunkMiddleware
  ]

  if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined') {
      middleware.push(createLogger())
    }
  }

  return createStore(
    combineReducers({
      api,
      user,
      todo,
      intl: intlReducer,
      router: routerReducer
    }),
    state,
    applyMiddleware(...middleware)
  )
}
