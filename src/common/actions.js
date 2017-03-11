
import ajax from 'common/ajax'
import {push} from 'react-router-redux'

import {clearTodoList, updateTodoList} from 'common/todo/redux'

export const REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS'
export const initiateRequest = () => ({type: REQUEST_IN_PROGRESS})

export const REQUEST_COMPLETED = 'REQUEST_COMPLETED'
export const finishRequest = () => ({type: REQUEST_COMPLETED})

export const REQUEST_FAILED = 'REQUEST_FAILED'
export const errorRequest = error => ({type: REQUEST_FAILED, error})

export const UPDATE_USER = 'UPDATE_USER'
export const updateUser = user => ({type: UPDATE_USER, user})

export const CLEAR_USER = 'CLEAR_USER'
export const clearUser = () => ({type: CLEAR_USER, user: null})

export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const logout = () => dispatch =>
  ajax(dispatch)('/api/auth/logout', 'POST')
    .then(() => dispatch(clearUser({})))
    .then(() => dispatch(clearTodoList()))
    .then(() => dispatch(push('/')))

export const AUTH_LOGIN = 'AUTH_LOGIN'
export const login = credentials => dispatch =>
  ajax(dispatch)('/api/auth/login', 'POST', credentials)
    .then(user => dispatch(updateUser(user)))
    .then(() => dispatch(updateTodoList()))
    .then(() => dispatch(push('/todo')))

export const AUTH_REGISTER = 'AUTH_REGISTER'
export const register = credentials => dispatch =>
  ajax(dispatch)('/api/auth/register', 'POST', credentials)
    .then(user => dispatch(updateUser(user)))
    .then(() => dispatch(updateTodoList()))
    .then(() => dispatch(push('/todo')))
