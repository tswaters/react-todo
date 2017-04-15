
import {createSelector} from 'reselect'

const REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS'
const REQUEST_COMPLETED = 'REQUEST_COMPLETED'
const REQUEST_FAILED = 'REQUEST_FAILED'

export const getRequestStats = createSelector([
  state => state.api
], api => ({
  requestInProgress: api.inProgress,
  requestError: api.error
}))

export const initiateRequest = () => ({type: REQUEST_IN_PROGRESS})

export const finishRequest = () => ({type: REQUEST_COMPLETED})

export const errorRequest = error => ({type: REQUEST_FAILED, error})

const defaultState = {
  inProgress: false,
  failed: false,
  error: null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_IN_PROGRESS:
      return {...state, inProgress: true}
    case REQUEST_FAILED:
      return {...state, inProgress: false, failed: true, error: action.error}
    case REQUEST_COMPLETED:
      return {...state, inProgress: false}
    default:
      return state
  }
}
