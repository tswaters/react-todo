
import {createSelector} from 'reselect'
import {LOCATION_CHANGE} from 'react-router-redux'

const REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS'
const REQUEST_COMPLETED = 'REQUEST_COMPLETED'
const REQUEST_FAILED = 'REQUEST_FAILED'
const REQUEST_INFO = 'REQUEST_INFO'

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
