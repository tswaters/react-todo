
import {
  ADD_TODO,
  CREATE_TODO,
  REMOVE_TODO,
  UPDATE_TODO,
  UPDATE_TODO_TEXT,
  EDIT_TODO
} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case ADD_TODO:
    case CREATE_TODO:
    case UPDATE_TODO:
      return {id: '', text: ''}

    case REMOVE_TODO:
      return state && state.id === action.id ? null : state

    case UPDATE_TODO_TEXT:
      return Object.assign({}, state, {text: action.text})

    case EDIT_TODO:
      return action.todo

    default:
      return state
  }
}
