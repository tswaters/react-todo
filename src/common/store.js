
import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import {routerReducer, routerMiddleware} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import * as api from './reducers'
import todo from './todo/redux'

export default (history, state) => createStore(
  combineReducers({
    ...api,
    todo,
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
