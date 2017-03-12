
import {createSelector} from 'reselect'

export const getList = createSelector([
  state => state.todo.list
], list => ({list}))

export const getItem = createSelector([
  (state, ownProps) => state.todo.list.find(item => item.id === ownProps.id)
], item => ({item}))

export const getEditing = createSelector([
  state => state.todo.item
], item => ({
  id: item ? item.id : '',
  text: item ? item.text : ''
}))
