
import * as assert from 'assert'
import * as sinon from 'sinon'
import supertest from 'supertest'

import appFactory from '../test-app'
import injector from 'inject-loader?-express!server/api/todo'

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
    const {default: todoController} = injector({
      'server/middleware/authorization': () => (req, res, next) => next(),
      'server/middleware/authentication': () => (req, res, next) => next(),
      'server/models/todo': {list, create, fetch, update, remove}
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
    it('should respond to errors', done => {
      list.rejects({status: 500, message: 'aw snap!'})
      client.get('/api/todo')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(list.calledOnce)
          assert.deepEqual(list.firstCall.args[0], {userId: '1234'})
          done()
        })
    })
    it('should return results', done => {
      list.resolves([])
      client.get('/api/todo')
        .expect(200, [])
        .end(err => {
          if (err) { return done(err) }
          assert.ok(list.calledOnce)
          assert.deepEqual(list.firstCall.args[0], {userId: '1234'})
          done()
        })
    })
  })

  describe('#create', () => {
    it('should respond to errors', done => {
      create.rejects({status: 500, message: 'aw snap!'})
      client.post('/api/todo')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(create.calledOnce)
          assert.equal(create.firstCall.args.length, 1)
          done()
        })
    })
    it('should return results', done => {
      const payload = {text: 'test'}
      create.resolves({})
      client.post('/api/todo')
        .send(payload)
        .expect(200, {})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(create.calledOnce)
          assert.equal(create.firstCall.args.length, 1)
          assert.deepEqual(create.firstCall.args[0].text, payload.text)
          assert.deepEqual(create.firstCall.args[0].userId, '1234')
          done()
        })
    })
  })

  describe('#fetch', () => {
    it('should respond to errors', done => {
      fetch.rejects({status: 500, message: 'aw snap!'})
      client.get('/api/todo/1234')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(fetch.calledOnce)
          assert.deepEqual(fetch.firstCall.args[0], {userId: '1234', id: '1234'})
          done()
        })
    })
    it('should return results', done => {
      const payload = {id: '1234'}
      fetch.resolves(payload)
      client.get('/api/todo/1234')
        .send(payload)
        .expect(200, payload)
        .end(err => {
          if (err) { return done(err) }
          assert.ok(fetch.calledOnce)
          assert.equal(fetch.firstCall.args.length, 1)
          assert.deepEqual(fetch.firstCall.args[0], {userId: '1234', id: '1234'})
          done()
        })
    })
  })

  describe('#update', () => {
    let payload = null
    beforeEach(() => payload = {text: 'test'})

    it('should respond to errors', done => {
      update.rejects({status: 500, message: 'aw snap!'})
      client.put('/api/todo/1234')
        .send(payload)
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(update.calledOnce)
          assert.equal(update.firstCall.args.length, 1)
          assert.deepEqual(update.firstCall.args[0], {...payload, userId: '1234', id: '1234'})
          done()
        })
    })

    it('should return results', done => {
      update.resolves(payload)
      client.put('/api/todo/1234')
        .send(payload)
        .expect(200, payload)
        .end(err => {
          if (err) { return done(err) }
          assert.ok(update.calledOnce)
          assert.equal(update.firstCall.args.length, 1)
          assert.deepEqual(update.firstCall.args[0], {...payload, userId: '1234', id: '1234'})
          done()
        })
    })
  })

  describe('#remove', () => {
    it('should respond to errors', done => {
      remove.rejects({status: 500, message: 'aw snap!'})
      client.delete('/api/todo/1234')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(remove.calledOnce)
          assert.equal(remove.firstCall.args.length, 1)
          done()
        })
    })
    it('should return results', done => {
      remove.resolves({})
      client.delete('/api/todo/1234')
        .expect(200, {})
        .end(err => {
          if (err) { return done(err) }
          assert.ok(remove.calledOnce)
          assert.equal(remove.firstCall.args.length, 1)
          assert.deepEqual(remove.firstCall.args[0], {userId: '1234', id: '1234'})
          done()
        })
    })
  })
})
