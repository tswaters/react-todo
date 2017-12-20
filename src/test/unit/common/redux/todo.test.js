
import assert from 'assert'

import reducer, {
  UPDATE_TODO_LIST,
  CREATE_TODO,
  REMOVE_TODO,
  RESET_DIRTY,
  UPDATE_TODO_TEXT,
  getList,
  getTodo,
  updateTodoText,
  fetchTodos,
  createTodo,
  saveTodo,
  removeTodo
} from 'common/redux/todo'

import {CLEAR_USER} from 'common/redux/user'
import {REQUEST_IN_PROGRESS, REQUEST_COMPLETED, REQUEST_FAILED} from 'common/redux/api'

import fetchMock from 'fetch-mock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('todo store', () => {

  describe('reducer', () => {

    it('should return initial state', () => {
      assert.deepEqual(
        reducer(void 0, {}),
        {list: [], item: ''}
      )
    })

    it('should clear state on user clear', () => {
      assert.deepEqual(
        reducer({
          item: 'some-pending-item',
          list: [
            {dirty: false, id: 'item-1', text: 'item-1'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }, {type: CLEAR_USER}),
        {
          item: '',
          list: []
        }
      )
    })

    it('should update the list', () => {
      assert.deepEqual(
        reducer(void 0, {type: UPDATE_TODO_LIST, list: [
          {id: 'item-1', text: 'item-1'},
          {id: 'item-2', text: 'item-2'},
          {id: 'item-3', text: 'item-3'}
        ]}),
        {
          item: '',
          list: [
            {dirty: false, id: 'item-1', text: 'item-1'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }
      )
    })

    it('should append to the list', () => {
      assert.deepEqual(
        reducer({
          item: 'item-2',
          list: [
            {dirty: false, id: 'item-1', text: 'item-1'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }, {type: CREATE_TODO, todo: {id: 'item-4', text: 'item-4'}}),
        {
          item: '',
          list: [
            {dirty: false, id: 'item-1', text: 'item-1'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'},
            {dirty: false, id: 'item-4', text: 'item-4'}
          ]
        }
      )
    })

    it('should remove items properly', () => {
      assert.deepEqual(
        reducer({
          list: [
            {dirty: false, id: 'item-1', text: 'item-1'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }, {type: REMOVE_TODO, id: 'item-1'}),
        {
          list: [
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }
      )
    })

    it('should reset dirty properly', () => {
      assert.deepEqual(
        reducer({
          list: [
            {dirty: true, id: 'item-1', text: 'item-1'},
            {dirty: true, id: 'item-2', text: 'item-2'},
            {dirty: true, id: 'item-3', text: 'item-3'}
          ]
        }, {type: RESET_DIRTY, id: 'item-1'}),
        {
          list: [
            {dirty: false, id: 'item-1', text: 'item-1'},
            {dirty: true, id: 'item-2', text: 'item-2'},
            {dirty: true, id: 'item-3', text: 'item-3'}
          ]
        }
      )
    })

    it('should update todo text - pending item', () => {
      assert.deepEqual(
        reducer({
          item: 'pending-item',
          list: [
            {dirty: false, id: 'item-1', text: 'item-1'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }, {type: UPDATE_TODO_TEXT, text: 'new text'}),
        {
          item: 'new text',
          list: [
            {dirty: false, id: 'item-1', text: 'item-1'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }
      )
    })

    it('should update todo text - existing item', () => {
      assert.deepEqual(
        reducer({
          item: 'pending-item',
          list: [
            {dirty: false, id: 'item-1', text: 'old-text'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }, {type: UPDATE_TODO_TEXT, id: 'item-1', text: 'new text'}),
        {
          item: 'pending-item',
          list: [
            {dirty: true, id: 'item-1', text: 'new text'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }
      )
    })

  })

  describe('selectors', () => {

    let state = null

    beforeEach(() => {
      state = {
        todo: {
          item: 'pending-item',
          list: [
            {dirty: true, id: 'item-1', text: 'new text'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        }
      }
    })

    describe('getList', () => {
      it('should return list properly', () => {
        assert.deepEqual(getList(state), {
          item: 'pending-item',
          list: [
            {dirty: true, id: 'item-1', text: 'new text'},
            {dirty: false, id: 'item-2', text: 'item-2'},
            {dirty: false, id: 'item-3', text: 'item-3'}
          ]
        })
      })
    })

    describe('getTodo', () => {
      it('should return an item properly', () => {
        assert.deepEqual(getTodo(state, 'item-1'), {
          dirty: true, id: 'item-1', text: 'new text'
        })
      })
    })

  })

  describe('actions', () => {

    let mockStore = null
    let store = null

    beforeEach(() => {
      mockStore = configureMockStore([thunk])
      store = mockStore({todo: {
        item: 'pending-item',
        list: [
          {dirty: true, id: 'item-1', text: 'item-1'},
          {dirty: false, id: 'item-2', text: 'item-2'},
          {dirty: false, id: 'item-3', text: 'item-3'}
        ]
      }})
    })

    afterEach(() => {
      fetchMock.reset()
      fetchMock.restore()
    })

    describe('update todo text', () => {
      it('should generate action properly', () => {
        store.dispatch(updateTodoText('test-1', 'test-1'))
        assert.deepEqual(store.getActions(), [{
          type: UPDATE_TODO_TEXT,
          id: 'test-1',
          text: 'test-1'
        }])
      })
    })

    describe('fetch todo', () => {

      it('should handle errors', async () => {

        fetchMock.getOnce(`${process.env.BASE_URL}/api/todo`, {
          body: {message: 'aw snap!'},
          status: 500,
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(fetchTodos())

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_FAILED, error: {message: 'aw snap!'}}
        ])

      })

      it('should fetch todos', async () => {

        fetchMock.getOnce(`${process.env.BASE_URL}/api/todo`, {
          body: [
            {id: 'item-1', text: 'item-1'},
            {id: 'item-2', text: 'item-2'},
            {id: 'item-3', text: 'item-3'}
          ],
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(fetchTodos())

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: UPDATE_TODO_LIST, list: [
            {id: 'item-1', text: 'item-1'},
            {id: 'item-2', text: 'item-2'},
            {id: 'item-3', text: 'item-3'}
          ]}
        ])

      })
    })

    describe('create todo', () => {

      it('should handle errors', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/todo`, {
          body: {message: 'aw snap!'},
          status: 500,
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(createTodo('test-4'))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_FAILED, error: {message: 'aw snap!'}}
        ])

      })

      it('should create todo', async () => {

        fetchMock.postOnce(`${process.env.BASE_URL}/api/todo`, {
          body: {id: 'item-4', text: 'test-4'},
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(createTodo('test-4'))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: CREATE_TODO, todo: {id: 'item-4', text: 'test-4'}}
        ])
      })

    })

    describe('save todo', () => {
      it('should save todo - non-dirty', async () => {

        await store.dispatch(saveTodo({id: 'item-2', text: 'item-2'}))
        assert.deepEqual(store.getActions(), [])

      })

      it('should handle errors', async () => {

        fetchMock.putOnce(`${process.env.BASE_URL}/api/todo/item-1`, {
          body: {message: 'aw snap!'},
          status: 500,
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(saveTodo({id: 'item-1', text: 'updated-text'}))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_FAILED, error: {message: 'aw snap!'}}
        ])

      })

      it('should save todo - dirty', async () => {

        fetchMock.putOnce(`${process.env.BASE_URL}/api/todo/item-1`, {
          body: {ok: true},
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(saveTodo({id: 'item-1', text: 'updated-text'}))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: RESET_DIRTY, id: 'item-1'}
        ])
      })
    })

    describe('remove todo', () => {

      it('should handle errors', async () => {

        fetchMock.deleteOnce(`${process.env.BASE_URL}/api/todo/item-1`, {
          body: {message: 'aw snap!'},
          status: 500,
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(removeTodo('item-1'))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_FAILED, error: {message: 'aw snap!'}}
        ])

      })

      it('should remove todos', async () => {

        fetchMock.deleteOnce(`${process.env.BASE_URL}/api/todo/item-1`, {
          body: {ok: true},
          headers: {'content-type': 'application/json'}
        })

        await store.dispatch(removeTodo('item-1'))

        assert.deepEqual(store.getActions(), [
          {type: REQUEST_IN_PROGRESS},
          {type: REQUEST_COMPLETED},
          {type: REMOVE_TODO, id: 'item-1'}
        ])

      })
    })
  })
})
