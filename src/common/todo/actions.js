import ajax from '../ajax'


/**
 * Complete callback for fetches from the web service;
 * Updates the state of the list with new data from a web service
 */
export const UPDATE_TODO_LIST = 'UPDATE_TODO_LIST'
export const clearTodoList = () => ({type: UPDATE_TODO_LIST, list: []})
export const updateTodoList = () => dispatch =>
  ajax(dispatch)('/api/todo', 'GET')
    .then(data => dispatch({type: UPDATE_TODO_LIST, list: data}))

/**
 * Signalled by pressing the 'Create Todo' button on the add/edit form;
 * Adds a todo to the list
 */
export const CREATE_TODO = 'CREATE_TODO'
export const createTodo = text => dispatch =>
  ajax(dispatch)('/api/todo', 'POST', {text})
    .then(({id}) => {
      dispatch({type: CREATE_TODO, id, text})
    })

/**
 * Signalled by pressing the "Update Todo" button on the add/edit form;
 * Updates existing todo item on the list.
 */
export const UPDATE_TODO = 'UPDATE_TODO'
export const updateTodo = ({id, text}) => dispatch =>
  ajax(dispatch)(`/api/todo/${id}`, 'PUT', {text})
    .then(data => {
      dispatch({type: UPDATE_TODO, todo: data})
    })

/**
 * Signalled by pressing "Delete" button on the list;
 * Removes a todo item from the list, clears edit form if this one was active.
 */
export const REMOVE_TODO = 'REMOVE_TODO'
export const removeTodo = id => dispatch =>
  ajax(dispatch)(`/api/todo/${id}`, 'DELETE')
    .then(() => {
      dispatch({type: REMOVE_TODO, id})
    })

/**
 * Signalled by pressing "Edit" button on the list;
 * Copies a todo item from the list into the add/edit form
 */
export const EDIT_TODO = 'EDIT_TODO'
export const editTodo = todo => dispatch =>
  ajax(dispatch)(`/api/todo/${todo.id}`, 'GET')
    .then(data => dispatch({type: EDIT_TODO, todo: data}))

/**
 * Change handler for the todo textbox;
 * updates new value into state
 */
export const UPDATE_TODO_TEXT = 'UPDATE_TODO_TEXT'
export const updateTodoText = text => ({type: UPDATE_TODO_TEXT, text})

export const ADD_TODO = 'ADD_TODO'
export const addTodo = () => ({type: ADD_TODO})
