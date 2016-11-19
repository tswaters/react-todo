let nextTodoId = 1

export const CREATE_TODO = 'CREATE_TODO'

export const SAVE_TODO = 'SAVE_TODO'

export const UPDATE_TODO = 'UPDATE_TODO'

export const REMOVE_TODO = 'REMOVE_TODO'

export const EDIT_TODO = 'EDIT_TODO'

export const UPDATE_TODO_TEXT = 'UPDATE_TODO_TEXT'

export const updateTodoText = text => ({type: UPDATE_TODO_TEXT, text})

export const createTodo = text => ({type: CREATE_TODO, text, id: nextTodoId++})

export const updateTodo = todo => ({type: UPDATE_TODO, todo})

export const saveTodo = todo => ({type: SAVE_TODO, todo})

export const removeTodo = id => ({type: REMOVE_TODO, id})

export const editTodo = todo => ({type: EDIT_TODO, todo})
