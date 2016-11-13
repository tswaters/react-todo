
import {combineReducers} from 'redux'
import list from './todo-list'
import current from './todo-current'

export default combineReducers({
  list,
  current
})
