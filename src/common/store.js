
import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import {routerReducer, routerMiddleware} from 'react-router-redux'

import {reducers as todo} from './todo'

export default (history, state) => createStore(
  combineReducers({
    ...todo,
    routing: routerReducer
  }),
  state,
  compose(
    applyMiddleware(
      routerMiddleware(history)
    )
  )
)
