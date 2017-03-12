
import {createSelector} from 'reselect'

export const getUser = createSelector([
  state => state.user
], user => ({user}))
