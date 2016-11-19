
import {
  ADD_TODO,
  CREATE_TODO,
  UPDATE_TODO,
  UPDATE_TODO_TEXT,
  EDIT_TODO
} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case ADD_TODO:
    case CREATE_TODO:
    case UPDATE_TODO:
      return null

    case UPDATE_TODO_TEXT:
      return Object.assign({}, state, {text: action.text})

    case EDIT_TODO:
      return action.todo

    default:
      return state
  }
}
