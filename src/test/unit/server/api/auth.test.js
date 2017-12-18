
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
  const changePassword = sinon.stub()
  const update = sinon.stub()

  before(done => {
    const authController = proxyquire('server/api/auth', {
      'server/middleware/authorization': {default: () => (req, res, next) => next()},
      'server/middleware/authentication': {default: () => (req, res, next) => next()},
      'server/models/user': {default: {
        register,
        login,
        logout,
        changePassword,
        update
      }}
    }).default
    const {app, context} = appFactory()
    context.use((req, res, next) => {
      res.locals.user = {id: '1234', userName: 'userName'}
      next()
    })
    context.use('/api/auth', authController)
    client = supertest(app)
    server = app.listen(PORT, done)
  })

  afterEach(() => {
    register.reset()
    login.reset()
    logout.reset()
    changePassword.reset()
    update.reset()
  })

  after(done => {
    server.close(done)
  })

  describe('POST /password', () => {

    let payload = null

    beforeEach(() => {
      payload = {userName: 'userName', oldPassword: 'oldPassword', newPassword: 'newPassword'}
    })

    it('should handle errors', async () => {
      changePassword.rejects({status: 500, message: 'aw snap!'})

      await client.post('/api/auth/password')
        .send(payload)
        .expect(500, {status: 500, message: 'aw snap!'})

      assert.equal(changePassword.callCount, 1)
      const [, {userName, oldPassword, newPassword}] = changePassword.firstCall.args
      assert.equal(userName, 'userName')
      assert.equal(oldPassword, 'oldPassword')
      assert.equal(newPassword, 'newPassword')

    })

    it('should return the result', async () => {

      changePassword.resolves({userName: 'userName'})

      await client.post('/api/auth/password')
        .send(payload)
        .expect(200, {userName: 'userName'})

      assert.equal(changePassword.callCount, 1)
      const [, {userName, oldPassword, newPassword}] = changePassword.firstCall.args
      assert.equal(userName, 'userName')
      assert.equal(oldPassword, 'oldPassword')
      assert.equal(newPassword, 'newPassword')

    })

  })

  describe('POST /profile', () => {

    let payload = null

    beforeEach(() => {
      payload = {userName: 'userName'}
    })

    it('should handle errors', async () => {
      update.rejects({status: 500, message: 'aw snap!'})

      await client.post('/api/auth/profile')
        .send(payload)
        .expect(500, {status: 500, message: 'aw snap!'})

      assert.equal(update.callCount, 1)
      assert.deepEqual(update.firstCall.args[0], {userName: 'userName'})
      assert.deepEqual(update.firstCall.args[1], {where: {id: '1234'}})

    })

    it('should return the result', async () => {

      changePassword.resolves({userName: 'userName'})

      await client.post('/api/auth/profile')
        .send(payload)
        .expect(200, {id: '1234', userName: 'userName'})

      assert.equal(update.callCount, 1)
      assert.deepEqual(update.firstCall.args[0], {userName: 'userName'})
      assert.deepEqual(update.firstCall.args[1], {where: {id: '1234'}})

    })

  })

  describe('GET /profile', () => {

    it('should return the result', async () => {

      await client.get('/api/auth/profile')
        .expect(200, {userName: 'userName'})

    })

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
