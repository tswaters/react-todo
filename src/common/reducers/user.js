
import {UPDATE_USER, CLEAR_USER} from '../actions'

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
