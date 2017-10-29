
import {createSelector} from 'reselect'
import ajax from 'common/ajax'
import {CLEAR_USER} from 'common/redux/user'

export const getList = createSelector([
  state => state.todo.list,
  state => state.todo.item
], (
  list,
  item
) => ({
  list,
  item
}))

export const getTodo = createSelector([
  (state, id) => state.todo.list.find(item => item.id === id)
], item => item)

const UPDATE_TODO_TEXT = 'UPDATE_TODO_TEXT'
const REMOVE_TODO = 'REMOVE_TODO'
const CREATE_TODO = 'CREATE_TODO'
const UPDATE_TODO_LIST = 'UPDATE_TODO_LIST'
const RESET_DIRTY = 'RESET_DIRTY'

export const updateTodoText = (id, text) => ({type: UPDATE_TODO_TEXT, id, text})

export const fetchTodos = () => async (dispatch, getState) => {
  const data = await ajax(dispatch, getState)('/api/todo', 'GET')
  if (data) {
    dispatch({type: UPDATE_TODO_LIST, list: data})
  }
}

export const createTodo = text => async (dispatch, getState) => {
  const todo = await ajax(dispatch, getState)('/api/todo', 'POST', {text})
  if (todo) {
    dispatch({type: CREATE_TODO, todo})
  }
}

export const saveTodo = ({id, text}) => async (dispatch, getState) => {
  const todo = getTodo(getState(), id)
  if (!todo.dirty) { return Promise.resolve(null) }

  const result = await ajax(dispatch, getState)(`/api/todo/${id}`, 'PUT', {text})
  if (result) {
    dispatch({type: RESET_DIRTY, id})
  }
}

export const removeTodo = id => async (dispatch, getState) => {
  const result = await ajax(dispatch, getState)(`/api/todo/${id}`, 'DELETE')
  if (result) {
    dispatch({type: REMOVE_TODO, id})
  }
}

const initialState = {
  list: [],
  item: ''
}

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_USER:
      return {...initialState}

    case UPDATE_TODO_LIST:
      return {...state, list: action.list}

    case CREATE_TODO:
      return {item: '', list: state.list.concat(action.todo)}

    case REMOVE_TODO:
      return {...state, list: state.list.filter(todo => todo.id !== action.id)}

    case RESET_DIRTY:
      return {
        ...state,
        list: state.list.map(todo =>
          todo.id === action.id
            ? {...todo, dirty: false}
            : todo
        )
      }

    case UPDATE_TODO_TEXT:
      return {
        item: action.id ? state.item : action.text,
        list: action.id ? state.list.map(todo =>
          todo.id === action.id
            ? {...todo, dirty: true, text: action.text}
            : todo
        ) : state.list
      }

    default:
      return state
  }
}
