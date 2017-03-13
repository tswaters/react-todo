
import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import {routerReducer, routerMiddleware} from 'react-router-redux'
import {reducer as reduxAsyncConnect} from 'redux-connect'
import thunkMiddleware from 'redux-thunk'
import {intlReducer} from 'react-intl-redux'

import api from './redux/api'
import user from './redux/user'
import todo from './todo/redux'

export default (history, state) => createStore(
  combineReducers({
    api,
    user,
    todo,
    intl: intlReducer,
    reduxAsyncConnect,
    routing: routerReducer
  }),
  state,
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunkMiddleware
    )
  )
)
