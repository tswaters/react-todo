
import assert from 'assert'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import testModel from 'test/unit/server/models/test-model'

const uuidStub = sinon.stub()
const hashifierCompareStub = sinon.stub()
const hashifierHashStub = sinon.stub()
const fetchTokenStub = sinon.stub()
const destroyTokenStub = sinon.stub()
const upsertTokenStub = sinon.stub()

describe('user model', () => {
  let UserModel = null
  let item = null
  let findByIdStub = null
  let findOneStub = null
  let createUserStub = null

  beforeEach(() => {
    UserModel = proxyquire('server/models/user', {
      hashifier: {
        compare: hashifierCompareStub,
        hash: hashifierHashStub
      },
      'server/models/token': {
        fetch: fetchTokenStub,
        destroy: destroyTokenStub,
        upsert: upsertTokenStub
      },
      uuid: {
        v4: uuidStub
      }
    }).default

    findByIdStub = sinon.stub(UserModel, 'findById')
    findOneStub = sinon.stub(UserModel, 'findOne')
    createUserStub = sinon.stub(UserModel, 'create')

    const attrs = ['id', 'userName', 'salt', 'hash']

    item = testModel(UserModel, attrs)({
      id: '12345',
      userName: 'test',
      salt: '12345',
      hash: '12345'
    })

    item.addRole = sinon.stub().resolves()

    findByIdStub.resolves(item)
    findOneStub.resolves(item)
    createUserStub.resolves(item)
    uuidStub.returns('4') // chosen by fair die roll
  })

  afterEach(() => {
    findByIdStub.reset()
    findOneStub.reset()
    hashifierCompareStub.reset()
    hashifierHashStub.reset()
    uuidStub.reset()
  })

  describe('.changePassword', () => {
    let payload = null
    let userId = null

    beforeEach(() => {
      userId = '1234'
      payload = {oldPassword: 'pass', newPassword: 'pass'}
    })

    it('should return bad request for no old password', async () => {
      delete payload.oldPassword

      let result = null
      try {
        result = await UserModel.changePassword(userId, payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 400)
        assert.equal(err.message, 'old password must be provided')
      }
    })

    it('should return bad request for no new password', async () => {
      delete payload.newPassword

      let result = null
      try {
        result = await UserModel.changePassword(userId, payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 400)
        assert.equal(err.message, 'new password must be provided')
      }
    })

    it('should throw not found if user not found', async () => {
      findByIdStub.resolves(null)

      let result = null
      try {
        result = await UserModel.changePassword(userId, payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 404)
      }
    })

    it('should throw if incorrect password', async () => {
      item.changePassword.rejects(new Error('nope'))
      let result = null
      try {
        result = await UserModel.changePassword(userId, payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.message, 'nope')
      }
    })

    it('should update the hash/salt, save & return json', async () => {
      item.changePassword.resolves()
      const result = await UserModel.changePassword(userId, payload)
      assert(result)
    })
  })

  describe('authorize', () => {
    let payload = null

    beforeEach(() => {
      payload = '12345'
    })

    it('rejects with unauthorized if token not found', async () => {
      fetchTokenStub.resolves(null)
      let result = null
      try {
        result = await UserModel.authorize(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 401)
        assert.equal(err.message, 'login token not found')
        assert.equal(fetchTokenStub.firstCall.args[0], '12345')
      }
    })

    it('rejects if the related user is not found', async () => {
      fetchTokenStub.resolves({userId: '12345'})
      findByIdStub.resolves(null)
      let result = null
      try {
        result = await UserModel.authorize(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 401)
        assert.equal(err.message, 'user not found')
        assert.equal(findByIdStub.firstCall.args[0], '12345')
      }
    })

    it('resolves to the user if everything appears ok', async () => {
      fetchTokenStub.resolves({userId: '12345'})
      const user = await UserModel.authorize(payload)
      assert.deepEqual(user, {
        id: '12345',
        token: '12345',
        userName: 'test',
        hash: '12345',
        salt: '12345'
      })
    })
  })

  describe('login', () => {
    let payload = null

    beforeEach(() => {
      payload = {
        userName: 'userName',
        password: 'password'
      }
    })

    it('rejects if username not provided', async () => {
      delete payload.userName
      let result = null
      try {
        result = await UserModel.login(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 400)
        assert.equal(err.message, 'userName must be provided')
      }
    })

    it('rejects if password not provided', async () => {
      delete payload.password
      let result = null
      try {
        result = await UserModel.login(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 400)
        assert.equal(err.message, 'password must be provided')
      }
    })

    it('rejects if user not found', async () => {
      findOneStub.resolves(null)
      let result = null
      try {
        result = await UserModel.login(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 401)
        assert.equal(err.message, 'user not found')
      }
    })

    it('rejects if passwords dont match', async () => {
      item.compare.returns(false)
      let result = null
      try {
        result = await UserModel.login(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 401)
        assert.equal(err.message, 'user not found')
      }
    })

    it('creates a token and resovles id', async () => {
      item.compare.returns(true)
      upsertTokenStub.resolves({id: '12345'})
      const user = await UserModel.login(payload)
      assert.deepEqual(user, {
        id: '12345',
        userName: 'test',
        hash: '12345',
        salt: '12345',
        token: '12345'
      })
      assert.deepEqual(findOneStub.firstCall.args[0], {where: {userName: 'userName'}})
      assert.equal(item.compare.firstCall.args[0], 'password')
      assert.deepEqual(upsertTokenStub.firstCall.args[1], '12345')
    })
  })

  describe('logout', () => {
    it('removes the token', async () => {
      destroyTokenStub.resolves(null)
      await UserModel.logout('1234')
      assert.equal(destroyTokenStub.firstCall.args[0], '1234')
    })
  })

  describe('register', () => {
    let payload = null

    beforeEach(() => {
      payload = {
        userName: 'test',
        password: 'password'
      }
    })

    it('rejects if username not provided', async () => {
      delete payload.userName
      let result = null
      try {
        result = await UserModel.register(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 400)
        assert.equal(err.message, 'userName must be provided')
      }
    })

    it('rejects if password not provided', async () => {
      delete payload.password
      let result = null
      try {
        result = await UserModel.register({userName: 'test'})
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 400)
        assert.equal(err.message, 'password must be provided')
      }
    })

    it('throws if user already found', async () => {
      let result = null
      try {
        result = await UserModel.register(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(result, null)
        assert.equal(err.status, 400)
        assert.equal(err.message, 'userName already in use!')
      }
    })

    it('hashes the password, creates a token and resolves to token id', async () => {
      hashifierHashStub.resolves({hash: 'hash', salt: 'salt'})
      upsertTokenStub.resolves({id: '1234'})
      findOneStub.resolves(null)

      const id = await UserModel.register({userName: 'userName', password: 'password'})

      assert.equal(id, '1234')
      assert.equal(hashifierHashStub.firstCall.args[0], 'password')
      assert.deepEqual(createUserStub.firstCall.args[0], {
        id: '4',
        hash: 'hash',
        salt: 'salt',
        userName: 'userName'
      })

      assert.deepEqual(upsertTokenStub.firstCall.args[1], '12345')
    })
  })
})
