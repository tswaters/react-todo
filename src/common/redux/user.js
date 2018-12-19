
import {createSelector} from 'reselect'
import {push} from 'connected-react-router'
import {performRequest} from 'common/redux/api'
import {fetchTodos} from 'common/redux/todo'
import qs from 'querystring'

export const UPDATE_USER = 'UPDATE_USER'
export const CLEAR_USER = 'CLEAR_USER'

export const getUser = createSelector([
  state => state.user
], user => ({user}))

export const updateUser = user => ({type: UPDATE_USER, user})

export const clearUser = () => ({type: CLEAR_USER})

export const logout = () => async dispatch => {
  const result = await dispatch(performRequest('/api/auth/logout', 'POST'))
  if (result) {
    dispatch(clearUser())
    dispatch(push('/'))
  }
}

export const login = credentials => async (dispatch, getState) => {
  const {router} = getState()
  const parsed = qs.parse(router.location.search.substr(1))
  const redirectPath = parsed.from ? parsed.from : '/todo'
  const user = await dispatch(performRequest('/api/auth/login', 'POST', credentials))
  if (user) {
    dispatch(updateUser(user))
    await dispatch(fetchTodos())
    dispatch(push(redirectPath))
  }
}

export const register = credentials => async dispatch => {
  const user = await dispatch(performRequest('/api/auth/register', 'POST', credentials))
  if (user) {
    dispatch(updateUser(user))
    await dispatch(fetchTodos())
    dispatch(push('/todo'))
  }
}

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
