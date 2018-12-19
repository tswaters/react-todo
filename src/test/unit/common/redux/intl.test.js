
import assert from 'assert'
import reducer, {getMessage, addMessages, ADD_LOCALE_MESSAGE} from 'common/redux/intl'

import fetchMock from 'fetch-mock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('intl store', () => {

  describe('reducer', () => {
    it('should return initial state', () => {
      assert.deepEqual(
        reducer(void 0, {}),
        {locale: 'en', messages: {}}
      )
    })

    it('should add locale messages properly', () => {
      assert.deepEqual(
        reducer(void 0, {type: ADD_LOCALE_MESSAGE, locale: 'en', messages: {test: 'test'}}),
        {locale: 'en', messages: {test: 'test'}}
      )

      assert.deepEqual(
        reducer({messages: {existing: 'existing'}}, {type: ADD_LOCALE_MESSAGE, locale: 'en', messages: {test: 'test'}}),
        {locale: 'en', messages: {existing: 'existing', test: 'test'}}
      )
    })

  })

  describe('selectors', () => {
    describe('get message', () => {
      it('should retrieve a message properly', () => {
        const state = {intl: {locale: 'en', messages: {test: 'test'}}}
        const selector = getMessage('test')
        assert.deepEqual(selector(state), {message: 'test'})
      })
    })
  })

  describe('actions', () => {

    let mockStore = null
    let store = null

    beforeEach(() => {
      mockStore = configureMockStore([thunk])
      store = mockStore({locale: 'en', messages: {}})
    })

    afterEach(() => {
      fetchMock.reset()
      fetchMock.restore()
    })

    describe('add messaage', () => {

      it('should create an action to add a message', () => {
        store.dispatch(addMessages('en', {test: 'test'}))
        assert.deepEqual(store.getActions(), [{
          type: ADD_LOCALE_MESSAGE,
          locale: 'en',
          messages: {test: 'test'}
        }])
      })

    })

  })
})
