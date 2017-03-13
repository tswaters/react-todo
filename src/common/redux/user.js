
import {createSelector} from 'reselect'
import {push} from 'react-router-redux'
import ajax from 'common/ajax'
import {clearTodoList, updateTodoList} from 'common/todo/redux'

export const UPDATE_USER = 'UPDATE_USER'
export const CLEAR_USER = 'CLEAR_USER'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const AUTH_LOGIN = 'AUTH_LOGIN'
export const AUTH_REGISTER = 'AUTH_REGISTER'

export const getUser = createSelector([
  state => state.user
], user => ({user}))

export const updateUser = user => ({type: UPDATE_USER, user})

export const clearUser = () => ({type: CLEAR_USER, user: null})

export const logout = () => dispatch =>
  ajax(dispatch)('/api/auth/logout', 'POST')
    .then(() => dispatch(clearUser({})))
    .then(() => dispatch(clearTodoList()))
    .then(() => dispatch(push('/')))

export const login = credentials => dispatch =>
  ajax(dispatch)('/api/auth/login', 'POST', credentials)
    .then(user => dispatch(updateUser(user)))
    .then(() => dispatch(updateTodoList()))
    .then(() => dispatch(push('/todo')))

export const register = credentials => dispatch =>
  ajax(dispatch)('/api/auth/register', 'POST', credentials)
    .then(user => dispatch(updateUser(user)))
    .then(() => dispatch(updateTodoList()))
    .then(() => dispatch(push('/todo')))

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return action.user
    case CLEAR_USER:
      return null
    default:
      return state
  }
}
