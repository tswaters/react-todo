
import {createSelector} from 'reselect'
import ajax from 'common/ajax'

export const getList = createSelector([
  state => state.todo.list
], list => ({list}))

export const getItem = createSelector([
  (state, ownProps) => state.todo.list.find(item => item.id === ownProps.id)
], item => ({item}))

export const getEditing = createSelector([
  state => state.todo.item
], item => ({
  id: item ? item.id : '',
  text: item ? item.text : ''
}))

const UPDATE_TODO_TEXT = 'UPDATE_TODO_TEXT'
const ADD_TODO = 'ADD_TODO'
const EDIT_TODO = 'EDIT_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const UPDATE_TODO = 'UPDATE_TODO'
const CREATE_TODO = 'CREATE_TODO'
const UPDATE_TODO_LIST = 'UPDATE_TODO_LIST'

export const addTodo = () => ({type: ADD_TODO})

export const clearTodoList = () => ({type: UPDATE_TODO_LIST, list: []})

export const updateTodoText = text => ({type: UPDATE_TODO_TEXT, text})

export const updateTodoList = () => (dispatch, getState) =>
  ajax(dispatch, getState)('/api/todo', 'GET')
    .then(data => dispatch({type: UPDATE_TODO_LIST, list: data}))

export const createTodo = text => (dispatch, getState) =>
  ajax(dispatch, getState)('/api/todo', 'POST', {text})
    .then(({id}) => dispatch({type: CREATE_TODO, id, text}))

export const updateTodo = ({id, text}) => (dispatch, getState) =>
  ajax(dispatch, getState)(`/api/todo/${id}`, 'PUT', {text})
    .then(data => dispatch({type: UPDATE_TODO, todo: data}))

export const removeTodo = id => (dispatch, getState) =>
  ajax(dispatch, getState)(`/api/todo/${id}`, 'DELETE')
    .then(() => dispatch({type: REMOVE_TODO, id}))

export const editTodo = id => (dispatch, getState) =>
  ajax(dispatch, getState)(`/api/todo/${id}`, 'GET')
    .then(data => dispatch({type: EDIT_TODO, todo: data}))

export default (state = [], action) => {
  if ([
    UPDATE_TODO_TEXT,
    ADD_TODO,
    EDIT_TODO,
    REMOVE_TODO,
    UPDATE_TODO,
    CREATE_TODO,
    UPDATE_TODO_LIST
  ].indexOf(action.type) === -1) {
    return state
  }

  const newState = {}

  // Update the state of the currently editing item

  if ([ADD_TODO, CREATE_TODO, UPDATE_TODO].indexOf(action.type) > -1) {
    newState.item = {id: '', text: ''}
  } else if (action.type === REMOVE_TODO && state.item && state.item.id === action.id) {
    newState.item = null
  } else if (action.type === UPDATE_TODO_TEXT) {
    newState.item = {...state.item, text: action.text}
  } else if (action.type === EDIT_TODO) {
    newState.item = action.todo
  } else {
    newState.item = state.item
  }

  // Update the state of the list

  if (action.type === UPDATE_TODO_LIST) {
    newState.list = action.list
  } else if (action.type === CREATE_TODO) {
    newState.list = [...state.list, {id: action.id, text: action.text}]
  } else if (action.type === REMOVE_TODO) {
    newState.list = state.list.filter(todo => todo.id !== action.id)
  } else if (action.type === UPDATE_TODO) {
    newState.list = state.list.map(todo => todo.id === action.todo.id ? action.todo : todo)
  } else {
    newState.list = state.list
  }

  return newState
}
