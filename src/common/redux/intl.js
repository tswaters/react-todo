import {createSelector} from 'reselect'
import en from 'react-intl/locale-data/en'
import {addLocaleData} from 'react-intl'

// The reducer for `react-intl-redux` is kind of bad.
// It doesn't allow for speculatively adding various locale keys.
// It's all "one update replaces everything"

export const ADD_LOCALE_MESSAGE = 'ADD_LOCALE_MESSAGE'

export const addMessages = (locale, messages) => ({type: ADD_LOCALE_MESSAGE, locale, messages})

export const getMessage = id => createSelector([state => state.intl.messages[id]], message => ({message}))


const initialState = {
  locale: 'en',
  messages: {}
}

addLocaleData([...en])

export default (state = initialState, action) => {
  if (action.type !== ADD_LOCALE_MESSAGE) { return state }
  return {
    locale: action.locale,
    messages: {...state.messages, ...action.messages}
  }
}
