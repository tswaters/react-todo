
import supertest from 'supertest'
import * as sinon from 'sinon'
import * as assert from 'assert'

import appFactory from '../test-app'
import authInjector from 'inject-loader?-express!server/api/auth'

const {
  PORT = 3001
} = process.env

describe('auth controller', () => {
  let client = null
  let server = null

  const register = sinon.stub()
  const login = sinon.stub()
  const logout = sinon.stub()

  before(done => {
    const {default: authController} = authInjector(
      {'server/models/user': {register, login, logout}}
    )
    const {app, context} = appFactory()
    context.use('/api/auth', authController)
    client = supertest(app)
    server = app.listen(PORT, done)
  })

  afterEach(() => {
    register.reset()
    login.reset()
    logout.reset()
  })

  after(done => {
    server.close(done)
  })

  describe('register', () => {
    it('should return errors', done => {
      register.rejects({status: 500, message: 'aw snap!'})
      client.post('/api/auth/register')
        .send({username: 'username', password: 'password'})
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          const [{username, password}] = register.firstCall.args
          assert.equal(username, 'username')
          assert.equal(password, 'password')
          done()
        })
    })
    it('should respond with json', done => {
      register.resolves('1234')
      client.post('/api/auth/register')
        .send({username: 'username', password: 'password'})
        .expect(200, {token: '1234'})
        .end(err => {
          if (err) { return done(err) }
          const [{username, password}] = register.firstCall.args
          assert.equal(username, 'username')
          assert.equal(password, 'password')
          done()
        })
    })
  })

  describe('login', () => {
    it('should return errors', done => {
      login.rejects({status: 500, message: 'aw snap!'})
      client.post('/api/auth/login')
        .send({username: 'username', password: 'password'})
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(err => {
          if (err) { return done(err) }
          const [{username, password}] = login.firstCall.args
          assert.equal(username, 'username')
          assert.equal(password, 'password')
          done()
        })
    })
    it('should respond with json', done => {
      login.resolves({token: '1234'})
      client.post('/api/auth/login')
        .send({username: 'username', password: 'password'})
        .expect(200, {token: '1234'})
        .end(err => {
          if (err) { return done(err) }
          const [{username, password}] = login.firstCall.args
          assert.equal(username, 'username')
          assert.equal(password, 'password')
          done()
        })
    })
  })

  describe('logout', () => {
    it('should return errors', done => {
      logout.rejects({status: 500, message: 'aw snap!'})
      client.post('/api/auth/logout')
        .expect(500, {status: 500, message: 'aw snap!'})
        .end(done)
    })
    it('should respond with json', done => {
      logout.resolves({id: '1234'})
      client.post('/api/auth/logout')
        .expect(200, {})
        .end(done)
    })
  })
})
