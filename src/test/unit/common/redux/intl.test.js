
import assert from 'assert'
import reducer, {getMessage, addMessage, getKeys, ADD_LOCALE_MESSAGE} from 'common/redux/intl'
import {REQUEST_IN_PROGRESS, REQUEST_COMPLETED, REQUEST_FAILED} from 'common/redux/api'

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
        store.dispatch(addMessage('en', {test: 'test'}))
        assert.deepEqual(store.getActions(), [{
          type: ADD_LOCALE_MESSAGE,
          locale: 'en',
          messages: {test: 'test'}
        }])
      })

    })

    describe('get keys', () => {

      it('should do nothing if messages not sent', async () => {
        await store.dispatch(getKeys('en', []))
        assert.deepEqual(store.getActions(), [])
      })

      it('should handle errors', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/locale`, {
          status: 500,
          body: {message: 'aw snap!'}
        })

        await store.dispatch(getKeys('en', ['test']))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_FAILED, error: {message: 'aw snap!'}},
        ])

      })

      it('should fetch the keys properly', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/locale`, {
          body: {locale: 'en', messages: {test: 'test'}},
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(getKeys('en', ['test']))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: ADD_LOCALE_MESSAGE, locale: 'en', messages: {test: 'test'}}
        ])

      })
    })
  })
})
