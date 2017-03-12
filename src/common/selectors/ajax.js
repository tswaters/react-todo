
import {createSelector} from 'reselect'

export const getRequestStats = createSelector([
  state => state.api
], api => ({
  requestInProgress: api.inProgress,
  requestError: api.error
}))
