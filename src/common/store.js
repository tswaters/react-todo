
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {routerReducer, routerMiddleware} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import api from 'common/redux/api'
import user from 'common/redux/user'
import intl from 'common/redux/intl'
import todo from 'common/redux/todo'
import profile from 'common/redux/profile'

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
      profile,
      intl,
      router: routerReducer
    }),
    state,
    applyMiddleware(...middleware)
  )
}
