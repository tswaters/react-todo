
import {
  REQUEST_IN_PROGRESS,
  REQUEST_FAILED
} from '../actions'

const defaultState = {
  inProgress: false,
  failed: false,
  error: null
}

export default (state = defaultState, action) => ({
  inProgress: action.type === REQUEST_IN_PROGRESS,
  failed: action.type === REQUEST_FAILED,
  error: action.type === REQUEST_FAILED ? action.error : null
})
