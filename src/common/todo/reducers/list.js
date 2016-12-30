
import {
  CREATE_TODO,
  REMOVE_TODO,
  UPDATE_TODO,
  UPDATE_TODO_LIST
} from '../actions'

export default (state = [], action) => {
  switch (action.type) {

    case UPDATE_TODO_LIST:
      return action.list

    case CREATE_TODO:
      return [...state, {id: action.id, text: action.text}]

    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id)

    case UPDATE_TODO:
      return state.map(todo => todo.id === action.todo.id ? action.todo : todo)

    default:
      return state
  }
}
