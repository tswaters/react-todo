import assert from 'assert'
import sinon from 'sinon'

import TodoModel from 'server/models/todo'
import testModel from './test-model'

describe('todo model', () => {
  let findAllStub = null
  let findByIdStub = null
  let list = null
  let item = null

  beforeEach(() => {
    findAllStub = sinon.stub(TodoModel, 'findAll')
    findByIdStub = sinon.stub(TodoModel, 'findById')

    const attrs = ['id', 'text']

    list = [
      testModel(TodoModel, attrs)({id: '1234', text: 'test 1'}),
      testModel(TodoModel, attrs)({id: '2345', text: 'test 2'})
    ]

    item = testModel(TodoModel, attrs)({id: '1234', text: 'test 1'})

    findAllStub.resolves(list)
    findByIdStub.resolves(item)
  })

  afterEach(() => {
    findAllStub.restore()
    findByIdStub.restore()
  })

  describe('.list', () => {
    it('should funtion properly', async () => {
      const items = await TodoModel.list({userId: '1234'})

      assert.deepEqual(items, [
        {id: '1234', text: 'test 1'},
        {id: '2345', text: 'test 2'}
      ])

      assert.equal(list[0].toJSON.callCount, 1)
      assert.equal(list[1].toJSON.callCount, 1)
    })
  })

  describe('.update', () => {
    let payload = null

    beforeEach(() => {
      payload = {id: '1234', userId: '1234', text: 'test 1'}
    })

    it('should throw bad request if text not provided', async () => {
      delete payload.text

      let result = null
      try {
        result = await TodoModel.update(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 400)
        assert.equal(err.message, 'text must be provided')
      }
    })

    it('should throw not found if todo not found', async () => {
      findByIdStub.resolves(null)

      let result = null
      try {
        result = await TodoModel.update(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 404)
      }
    })

    it('should save and return the json', async () => {
      const todo = await TodoModel.update({...payload, text: 'test 2'})
      assert.ok(todo)
      assert.equal(todo.text, 'test 2')
      assert.equal(item.save.callCount, 1)
      assert.equal(item.toJSON.callCount, 1)
    })
  })

  describe('.remove', () => {
    let payload = null

    beforeEach(() => {
      payload = {id: '1234', userId: '1234'}
    })

    it('should throw if todo not found', async () => {
      findByIdStub.resolves(null)
      let result = null
      try {
        result = await TodoModel.remove(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 404)
      }
    })

    it('should delete and return true', async () => {
      const result = await TodoModel.remove(payload)
      assert(result)
      assert.equal(item.destroy.callCount, 1)
    })
  })

  describe('.fetch', () => {
    let payload = null

    beforeEach(() => {
      payload = {id: '1234', userId: '1234'}
    })

    it('should throw if todo not found', async () => {
      findByIdStub.resolves(null)
      let result = null
      try {
        result = await TodoModel.fetch(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 404)
      }
    })

    it('should return todo to the caller', async () => {
      const todo = await TodoModel.fetch(payload)
      assert.equal(todo.text, 'test 1')
      assert.equal(item.toJSON.callCount, 1)
    })
  })
})
