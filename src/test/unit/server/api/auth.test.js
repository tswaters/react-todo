
import supertest from 'supertest'
import * as sinon from 'sinon'
import 'sinon-as-promised'
import * as assert from 'assert'

import appFactory from '../test-app'
import UserModel from 'server/lib/models/user'
import authInjector from 'inject?-express!server/lib/api/auth'

const {
  PORT = 3001
} = process.env

describe('auth controller', () => {
  let client = null
  let server = null

  const model = sinon.createStubInstance(UserModel)

  before(done => {
    const {default: authController} = authInjector({
      'server/lib/models': {
        UserModel: sinon.stub().returns(model)
      }
    })
    const {app, context} = appFactory()
    context.use('/api/auth', authController)
    client = supertest(app)
    server = app.listen(PORT, done)
  })

  afterEach(() => {
    model.register.reset()
    model.login.reset()
    model.logout.reset()
  })

  after(done => {
    server.close(done)
  })

  describe('register', () => {
    it('should return errors', done => {
      model.register.rejects({status: 500, message: 'aw snap!'})
      client.post('/api/auth/register')
        .send({username: 'username', password: 'password'})
        .expect(500, {message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          const {username, password} = model.register.firstCall.args[0]
          assert.equal(username, 'username')
          assert.equal(password, 'password')
          done()
        })
    })
    it('should respond with json', done => {
      model.register.resolves('1234')
      client.post('/api/auth/register')
        .send({username: 'username', password: 'password'})
        .expect(200, {})
        .end(err => {
          if (err) { return done(err) }
          const {username, password} = model.register.firstCall.args[0]
          assert.equal(username, 'username')
          assert.equal(password, 'password')
          done()
        })
    })
  })

  describe('login', () => {
    it('should return errors', done => {
      model.login.rejects({status: 500, message: 'aw snap!'})
      client.post('/api/auth/login')
        .send({username: 'username', password: 'password'})
        .expect(500, {message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          const {username, password} = model.login.firstCall.args[0]
          assert.equal(username, 'username')
          assert.equal(password, 'password')
          done()
        })
    })
    it('should respond with json', done => {
      model.login.resolves({token: '1234'})
      client.post('/api/auth/login')
        .send({username: 'username', password: 'password'})
        .expect(200, {})
        .end(err => {
          if (err) { return done(err) }
          const {username, password} = model.login.firstCall.args[0]
          assert.equal(username, 'username')
          assert.equal(password, 'password')
          done()
        })
    })
  })

  describe('logout', () => {
    it('should return errors', done => {
      model.logout.rejects({status: 500, message: 'aw snap!'})
      client.post('/api/auth/logout')
        .expect(500, {message: 'aw snap!'})
        .end(done)
    })
    it('should respond with json', done => {
      model.logout.resolves({id: '1234'})
      client.post('/api/auth/logout')
        .expect(200, {})
        .end(done)
    })
  })
})
