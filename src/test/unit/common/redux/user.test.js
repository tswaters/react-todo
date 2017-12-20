
import assert from 'assert'

import reducer, {
  UPDATE_USER,
  CLEAR_USER,
  getUser,
  updateUser,
  clearUser,
  logout,
  login,
  register
} from 'common/redux/user'

import {UPDATE_TODO_LIST} from 'common/redux/todo'
import {REQUEST_IN_PROGRESS, REQUEST_COMPLETED, REQUEST_FAILED} from 'common/redux/api'

import fetchMock from 'fetch-mock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('user store', () => {

  describe('reducer', () => {

    it('should return initial state', () => {
      assert.deepEqual(
        reducer(void 0, {}),
        null
      )
    })

    it('should update user properly', () => {
      assert.deepEqual(
        reducer(void 0, {type: UPDATE_USER, user: {id: '1234'}}),
        {id: '1234'}
      )
    })

    it('should clear user properly', () => {
      assert.deepEqual(
        reducer({user: {id: '1234'}}, {type: CLEAR_USER}),
        null
      )
    })

  })

  describe('selectors', () => {
    it('should return the user properly', () => {
      const state = {user: {id: '1234'}}
      assert.deepEqual(getUser(state), {user: {id: '1234'}})
    })
  })

  describe('actions', () => {

    let mockStore = null
    let store = null

    beforeEach(() => {
      mockStore = configureMockStore([thunk])
      store = mockStore({user: {id: '1234'}})
    })

    afterEach(() => {
      fetchMock.reset()
      fetchMock.restore()
    })

    describe('updateUser', () => {
      it('should generate action properly', () => {
        store.dispatch(updateUser({id: '1234'}))
        assert.deepEqual(store.getActions(), [{
          type: UPDATE_USER,
          user: {id: '1234'}
        }])
      })
    })

    describe('clearUser', () => {
      it('should generate action properly', () => {
        store.dispatch(clearUser())
        assert.deepEqual(store.getActions(), [{
          type: CLEAR_USER
        }])
      })
    })

    describe('logout', () => {

      it('should handle errors properly', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/auth/logout`, {
          body: {message: 'aw snap!'},
          status: 500,
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(logout())

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_FAILED, error: {message: 'aw snap!'}}
        ])
      })

      it('should log user out', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/auth/logout`, {
          body: {},
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(logout())

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: CLEAR_USER},
          {type: '@@router/CALL_HISTORY_METHOD', payload: {method: 'push', args: ['/']}}
        ])

      })

    })

    describe('login', () => {

      it('should handle errors properly', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/auth/login`, {
          body: {message: 'aw snap!'},
          status: 500,
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(login({userName: 'test', password: 'test'}))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_FAILED, error: {message: 'aw snap!'}}
        ])
      })

      it('should log user in, fetch todo list', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/auth/login`, {
          body: {id: '1234'},
          headers: {'content-type': 'application/json'}
        })

        fetchMock.getOnce(`${process.env.BASE_URL}/api/todo`, {
          body: ['something'],
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(login({userName: 'test', password: 'test'}))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: UPDATE_USER, user: {id: '1234'}},
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: UPDATE_TODO_LIST, list: ['something']},
          {type: '@@router/CALL_HISTORY_METHOD', payload: {method: 'push', args: ['/todo']}}
        ])

      })

    })

    describe('register', () => {

      it('should handle errors properly', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/auth/register`, {
          body: {message: 'aw snap!'},
          status: 500,
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(register({userName: 'test', password: 'test'}))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_FAILED, error: {message: 'aw snap!'}}
        ])
      })

      it('should register user, fetch todo list', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/auth/register`, {
          body: {id: '1234'},
          headers: {'content-type': 'application/json'}
        })

        fetchMock.getOnce(`${process.env.BASE_URL}/api/todo`, {
          body: [],
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(register({userName: 'test', password: 'test'}))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: UPDATE_USER, user: {id: '1234'}},
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: UPDATE_TODO_LIST, list: []},
          {type: '@@router/CALL_HISTORY_METHOD', payload: {method: 'push', args: ['/todo']}}
        ])

      })

    })

  })

})
