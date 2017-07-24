
import {createSelector} from 'reselect'
import {push} from 'react-router-redux'
import ajax from 'common/ajax'
import {fetchTodos} from 'common/todo/redux'

export const UPDATE_USER = 'UPDATE_USER'
export const CLEAR_USER = 'CLEAR_USER'

export const getUser = createSelector([
  state => state.user
], user => ({user}))

export const updateUser = user => ({type: UPDATE_USER, user})

export const clearUser = () => ({type: CLEAR_USER})

export const logout = () => (dispatch, getState) =>
  ajax(dispatch, getState)('/api/auth/logout', 'POST')
    .then(() => dispatch(clearUser()))
    .then(() => dispatch(push('/')))

export const login = credentials => (dispatch, getState) =>
  ajax(dispatch, getState)('/api/auth/login', 'POST', credentials)
    .then(user => dispatch(updateUser(user)))
    .then(() => dispatch(fetchTodos()))
    .then(() => dispatch(push('/todo')))

export const register = credentials => (dispatch, getState) =>
  ajax(dispatch, getState)('/api/auth/register', 'POST', credentials)
    .then(user => dispatch(updateUser(user)))
    .then(() => dispatch(fetchTodos()))
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
