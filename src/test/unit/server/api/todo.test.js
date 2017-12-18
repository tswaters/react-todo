
import * as assert from 'assert'
import * as sinon from 'sinon'
import supertest from 'supertest'
import proxyquire from 'proxyquire'
import appFactory from 'test/unit/server/test-app'

const {
  PORT = 3001
} = process.env

describe('todo controller', () => {
  let client = null
  let server = null

  const list = sinon.stub()
  const create = sinon.stub()
  const fetch = sinon.stub()
  const update = sinon.stub()
  const remove = sinon.stub()

  before(done => {
    const todoController = proxyquire('server/api/todo', {
      'server/middleware/authorization': {default: () => (req, res, next) => next()},
      'server/middleware/authentication': {default: () => (req, res, next) => next()},
      'server/models/todo': {default: {list, create, fetch, update, remove}}
    }).default

    const {app, context} = appFactory()
    context.use((req, res, next) => {
      res.locals.user = {id: '1234'}
      next()
    })
    context.use('/api/todo', todoController)

    client = supertest(app)
    server = app.listen(PORT, done)
  })

  afterEach(() => {
    list.reset()
    create.reset()
    fetch.reset()
    update.reset()
    remove.reset()
  })

  after(done => {
    server.close(done)
  })

  describe('#list', () => {
    it('should respond to errors', async () => {
      list.rejects({status: 500, message: 'aw snap!'})

      await client.get('/api/todo')
        .expect(500, {status: 500, message: 'aw snap!'})

      assert.ok(list.calledOnce)
      assert.deepEqual(list.firstCall.args[0], {userId: '1234'})
    })
    it('should return results', async () => {
      list.resolves([])

      await client.get('/api/todo')
        .expect(200, [])

      assert.ok(list.calledOnce)
      assert.deepEqual(list.firstCall.args[0], {userId: '1234'})
    })
  })

  describe('#create', () => {
    it('should respond to errors', async () => {
      create.rejects({status: 500, message: 'aw snap!'})

      await client.post('/api/todo')
        .expect(500, {status: 500, message: 'aw snap!'})

      assert.ok(create.calledOnce)
      assert.equal(create.firstCall.args.length, 1)
    })
    it('should return results', async () => {
      create.resolves({})

      await client.post('/api/todo')
        .send({text: 'test'})
        .expect(200, {})

      assert.ok(create.calledOnce)
      assert.equal(create.firstCall.args.length, 1)
      assert.deepEqual(create.firstCall.args[0].text, 'test')
      assert.deepEqual(create.firstCall.args[0].userId, '1234')

    })
  })

  describe('#fetch', () => {
    it('should respond to errors', async () => {
      fetch.rejects({status: 500, message: 'aw snap!'})

      await client.get('/api/todo/1234')
        .expect(500, {status: 500, message: 'aw snap!'})

      assert.ok(fetch.calledOnce)
      assert.deepEqual(fetch.firstCall.args[0], {userId: '1234', id: '1234'})

    })
    it('should return results', async () => {
      fetch.resolves({id: '1234'})

      await client.get('/api/todo/1234')
        .send({id: '1234'})
        .expect(200, {id: '1234'})

      assert.ok(fetch.calledOnce)
      assert.equal(fetch.firstCall.args.length, 1)
      assert.deepEqual(fetch.firstCall.args[0], {userId: '1234', id: '1234'})
    })
  })

  describe('#update', () => {
    let payload = null

    beforeEach(() => {
      payload = {text: 'test'}
    })

    it('should respond to errors', async () => {
      update.rejects({status: 500, message: 'aw snap!'})

      await client.put('/api/todo/1234')
        .send(payload)
        .expect(500, {status: 500, message: 'aw snap!'})

      assert.ok(update.calledOnce)
      assert.equal(update.firstCall.args.length, 1)
      assert.deepEqual(update.firstCall.args[0], {...payload, userId: '1234', id: '1234'})
    })

    it('should return results', async () => {
      update.resolves(payload)

      await client.put('/api/todo/1234')
        .send(payload)
        .expect(200, payload)

      assert.ok(update.calledOnce)
      assert.equal(update.firstCall.args.length, 1)
      assert.deepEqual(update.firstCall.args[0], {...payload, userId: '1234', id: '1234'})
    })
  })

  describe('#remove', () => {
    it('should respond to errors', async () => {
      remove.rejects({status: 500, message: 'aw snap!'})

      await client.delete('/api/todo/1234')
        .expect(500, {status: 500, message: 'aw snap!'})

      assert.ok(remove.calledOnce)
      assert.equal(remove.firstCall.args.length, 1)
    })
    it('should return results', async () => {
      remove.resolves({})

      await client.delete('/api/todo/1234')
        .expect(200, {})

      assert.ok(remove.calledOnce)
      assert.equal(remove.firstCall.args.length, 1)
      assert.deepEqual(remove.firstCall.args[0], {userId: '1234', id: '1234'})
    })
  })
})
