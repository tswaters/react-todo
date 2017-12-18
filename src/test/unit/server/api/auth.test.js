
import supertest from 'supertest'
import * as sinon from 'sinon'
import * as assert from 'assert'
import proxyquire from 'proxyquire'
import appFactory from 'test/unit/server/test-app'

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
    const authController = proxyquire('server/api/auth', {
      'server/models/user': {default: {register, login, logout}}
    }).default
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

  describe('password', () => {

  })

  describe('register', () => {

    it('should return errors', async () => {

      register.rejects({status: 500, message: 'aw snap!'})

      await client.post('/api/auth/register')
        .send({username: 'username', password: 'password'})
        .expect(500, {status: 500, message: 'aw snap!'})

      const [{username, password}] = register.firstCall.args
      assert.equal(username, 'username')
      assert.equal(password, 'password')

    })

    it('should respond with json', async () => {

      register.resolves('1234')

      await client.post('/api/auth/register')
        .send({username: 'username', password: 'password'})
        .expect(200, {token: '1234'})

      const [{username, password}] = register.firstCall.args
      assert.equal(username, 'username')
      assert.equal(password, 'password')

    })
  })

  describe('login', () => {

    it('should return errors', async () => {

      login.rejects({status: 500, message: 'aw snap!'})

      await client.post('/api/auth/login')
        .send({username: 'username', password: 'password'})
        .expect(500, {status: 500, message: 'aw snap!'})

      const [{username, password}] = login.firstCall.args
      assert.equal(username, 'username')
      assert.equal(password, 'password')

    })

    it('should respond with json', async () => {

      login.resolves({token: '1234'})

      await client.post('/api/auth/login')
        .send({username: 'username', password: 'password'})
        .expect(200, {token: '1234'})

      const [{username, password}] = login.firstCall.args
      assert.equal(username, 'username')
      assert.equal(password, 'password')

    })
  })

  describe('logout', () => {

    it('should return errors', async () => {

      logout.rejects({status: 500, message: 'aw snap!'})

      await client.post('/api/auth/logout')
        .expect(500, {status: 500, message: 'aw snap!'})

    })

    it('should respond with json', async () => {

      logout.resolves({id: '1234'})

      await client.post('/api/auth/logout')
        .expect(200, {})

    })
  })
})
