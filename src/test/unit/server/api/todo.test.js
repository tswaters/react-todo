
import * as assert from 'assert'
import * as sinon from 'sinon'
import 'sinon-as-promised'
import supertest from 'supertest'

import appFactory from '../test-app'
import {TodoStore} from 'server/lib/stores'
import injector from 'inject-loader?-express!server/lib/api/todo'

const {
  PORT = 3001
} = process.env

describe('todo controller', () => {
  let client = null
  let server = null

  const model = sinon.createStubInstance(TodoStore)

  before(done => {
    const {default: todoController} = injector({
      'server/lib/middleware/authorization': () => (req, res, next) => next(),
      'server/lib/middleware/authentication': () => (req, res, next) => next(),
      'server/lib/models': {
        TodoModel: sinon.stub().returns(model)
      }
    })

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
    model.list.reset()
    model.create.reset()
    model.fetch.reset()
    model.update.reset()
    model.remove.reset()
  })

  after(done => {
    server.close(done)
  })

  describe('#list', () => {
    it('should respond to errors', done => {
      model.list.rejects({status: 500, message: 'aw snap!'})
      client.get('/api/todo')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.list.calledOnce)
          assert.equal(model.list.firstCall.args.length, 0)
          done()
        })
    })
    it('should return results', done => {
      model.list.resolves([])
      client.get('/api/todo')
        .expect(200, [])
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.list.calledOnce)
          assert.equal(model.list.firstCall.args.length, 0)
          done()
        })
    })
  })

  describe('#create', () => {
    it('should respond to errors', done => {
      model.create.rejects({status: 500, message: 'aw snap!'})
      client.post('/api/todo')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.create.calledOnce)
          assert.equal(model.create.firstCall.args.length, 1)
          done()
        })
    })
    it('should return results', done => {
      const payload = {todo: 'test'}
      model.create.resolves({})
      client.post('/api/todo')
        .send(payload)
        .expect(200, {})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.create.calledOnce)
          assert.equal(model.create.firstCall.args.length, 1)
          assert.deepEqual(model.create.firstCall.args[0], payload)
          done()
        })
    })
  })

  describe('#fetch', () => {
    it('should respond to errors', done => {
      model.fetch.rejects({status: 500, message: 'aw snap!'})
      client.get('/api/todo/1234')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.fetch.calledOnce)
          assert.equal(model.fetch.firstCall.args.length, 1)
          done()
        })
    })
    it('should return results', done => {
      const payload = {id: '1234'}
      model.fetch.resolves(payload)
      client.get('/api/todo/1234')
        .send(payload)
        .expect(200, payload)
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.fetch.calledOnce)
          assert.equal(model.fetch.firstCall.args.length, 1)
          assert.deepEqual(model.fetch.firstCall.args[0], '1234')
          done()
        })
    })
  })

  describe('#update', () => {
    it('should respond to errors', done => {
      model.update.rejects({status: 500, message: 'aw snap!'})
      client.put('/api/todo/1234')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.update.calledOnce)
          assert.equal(model.update.firstCall.args.length, 2)
          done()
        })
    })
    it('should return results', done => {
      const payload = {todo: 'test'}
      model.update.resolves(payload)
      client.put('/api/todo/1234')
        .send(payload)
        .expect(200, payload)
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.update.calledOnce)
          assert.equal(model.update.firstCall.args.length, 2)
          assert.equal(model.update.firstCall.args[0], '1234')
          assert.deepEqual(model.update.firstCall.args[1], payload)
          done()
        })
    })
  })

  describe('#remove', () => {
    it('should respond to errors', done => {
      model.remove.rejects({status: 500, message: 'aw snap!'})
      client.delete('/api/todo/1234')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.remove.calledOnce)
          assert.equal(model.remove.firstCall.args.length, 1)
          done()
        })
    })
    it('should return results', done => {
      model.remove.resolves({})
      client.delete('/api/todo/1234')
        .expect(200, {})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(model.remove.calledOnce)
          assert.equal(model.remove.firstCall.args.length, 1)
          assert.equal(model.remove.firstCall.args[0], '1234')
          done()
        })
    })
  })
})
