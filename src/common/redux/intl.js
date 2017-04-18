
import ajax from '../ajax'

// The reducer for `react-intl-redux` is kind of bad.
// It doesn't allow for speculatively adding various locale keys.
// It's all "one update replaces everything"

const ADD_LOCALE_MESSAGE = 'ADD_LOCALE_MESSAGE'

export const addMessage = (locale, messages) => ({type: ADD_LOCALE_MESSAGE, locale, messages})

export const getKeys = (locale, messages) => (dispatch, getState) => {
  if (messages.length === 0) { return Promise.resolve() }
  return ajax(dispatch, getState)('/api/locale', 'POST', {messages, locale})
    .then(data => dispatch(addMessage(locale, data.messages)))
}

const initialState = {locale: 'en', messages: {}}

export default (state = initialState, action) => {
  if (action.type !== ADD_LOCALE_MESSAGE) { return state }
  return {
    locale: action.locale,
    messages: {...state.messages, ...action.messages}
  }
}
