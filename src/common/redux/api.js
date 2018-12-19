
import {createSelector} from 'reselect'
import {LOCATION_CHANGE} from 'connected-react-router'
import {getUser} from 'common/redux/user'

const baseUrl = process.env.BASE_URL

export const REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS'
export const REQUEST_COMPLETED = 'REQUEST_COMPLETED'
export const REQUEST_FAILED = 'REQUEST_FAILED'
export const REQUEST_INFO = 'REQUEST_INFO'

export const getRequestStats = createSelector([
  state => state.api
], api => ({
  requestInProgress: api.inProgress,
  requestError: api.error,
  requestInfo: api.info
}))

export const initiateRequest = () => ({type: REQUEST_IN_PROGRESS})

export const finishRequest = () => ({type: REQUEST_COMPLETED})

export const errorRequest = error => ({type: REQUEST_FAILED, error})

export const infoRequest = info => ({type: REQUEST_INFO, info})

export const performRequest = (url, method, body) => async (dispatch, getState) => {
  const {user} = getUser(getState())

  dispatch(initiateRequest())

  const response = await fetch(`${baseUrl}${url}`, {
    method,
    credentials: 'same-origin',
    headers: Object.assign(
      {'Content-Type': 'application/json'},
      user ? {'x-token': user.token} : null
    ),
    body: body ? JSON.stringify(body) : null
  })

  const result = await response.json()

  if (response.ok) {
    dispatch(finishRequest())
    return result
  } else {
    dispatch(errorRequest(result))
    throw result
  }
}

const defaultState = {
  inProgress: false,
  failed: false,
  error: null,
  info: null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return defaultState
    case REQUEST_IN_PROGRESS:
      return {...state, inProgress: true, info: null, error: null}
    case REQUEST_FAILED:
      return {...state, inProgress: false, failed: true, error: action.error}
    case REQUEST_COMPLETED:
      return {...state, inProgress: false, info: action.info || null}
    case REQUEST_INFO:
      return {...state, info: action.info}
    default:
      return state
  }
}
