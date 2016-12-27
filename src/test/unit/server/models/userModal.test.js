
import * as assert from 'assert'
import * as sinon from 'sinon'
import 'sinon-as-promised'

import {UserStore, LoginTokenStore} from 'server/lib/stores'

import injector from 'inject!server/lib/models/user'

describe('user model', () => {
  let UserModel = null
  let userModel = null

  const hashifierCompareStub = sinon.stub()
  const hashifierHashStub = sinon.stub()
  const loginStoreStub = sinon.createStubInstance(LoginTokenStore)
  const userStoreMethods = sinon.createStubInstance(UserStore)
  const userStoreStub = sinon.stub()
  Object.setPrototypeOf(userStoreStub.prototype, userStoreMethods)

  before(() => {
    UserModel = injector({
      'server/lib/stores': {
        UserStore: userStoreStub,
        LoginTokenStore: sinon.stub().returns(loginStoreStub)
      },
      hashifier: {
        compare: hashifierCompareStub,
        hash: hashifierHashStub
      }
    }).default
  })

  beforeEach(() => {
    userModel = new UserModel()
  })

  afterEach(() => {
    loginStoreStub.fetch.reset()
    userStoreMethods.fetch.reset()
    userStoreMethods.find.reset()
    hashifierCompareStub.reset()
    hashifierHashStub.reset()
  })

  describe('authorize', () => {
    it('rejects with bad request if token not provided', () =>
      userModel.authorize()
        .catch(err => {
          assert.equal(err.status, 400)
          assert.equal(err.message, 'invalid request')
        })
    )
    it('rejects with unauthorized if token not found', () => {
      loginStoreStub.fetch.resolves(null)
      return userModel.authorize('1234')
        .catch(err => {
          assert.equal(err.status, 401)
          assert.equal(err.message, 'invalid user')
        })
        .then(() => {
          assert.equal(loginStoreStub.fetch.firstCall.args[0], '1234')
        })
    })
    it('rejects if the related user is not found', () => {
      loginStoreStub.fetch.resolves({userId: '1234'})
      userStoreMethods.fetch.resolves(null)
      return userModel.authorize('1234')
        .catch(err => {
          assert.equal(err.status, 401)
          assert.equal(err.message, 'invalid user')
        })
        .then(() => {
          assert.equal(userStoreMethods.fetch.firstCall.args[0], '1234')
        })
    })
    it('resolves to the user if everything appears ok', () => {
      loginStoreStub.fetch.resolves({userId: '1234'})
      userStoreMethods.fetch.resolves({userId: '1234', name: 'Tyler'})
      return userModel.authorize('1234')
        .then(user => {
          assert.deepEqual(user, {userId: '1234', name: 'Tyler'})
        })
    })
  })

  describe('login', () => {
    it('rejects if nothing has been provided', () =>
      userModel.login()
        .catch(err => {
          assert.equal(err.status, 400)
          assert.equal(err.message, 'invalid request')
        })
    )
    it('rejects if username not provided', () =>
      userModel.login({})
        .catch(err => {
          assert.equal(err.status, 400)
          assert.equal(err.message, 'invalid request')
        })
    )

    it('rejects if password not provided', () =>
      userModel.login({userName: 'test'})
        .catch(err => {
          assert.equal(err.status, 400)
          assert.equal(err.message, 'invalid request')
        })
    )

    it('rejects if user not found', () => {
      userStoreMethods.find.resolves(null)
      return userModel.login({userName: 'test', password: 'test'})
        .catch(err => {
          assert.equal(err.status, 401)
          assert.equal(err.message, 'invalid user')
        })
    })

    it('rejects if passwords dont match', () => {
      userStoreMethods.find.resolves({id: '1234', hash: 'hash', salt: 'salt'})
      hashifierCompareStub.resolves(false)
      return userModel.login({userName: 'userName', password: 'password'})
        .catch(err => {
          assert.equal(err.status, 401)
          assert.equal(err.message, 'invalid user')
        })
    })

    it('creates a token and resovles id', () => {
      userStoreMethods.find.resolves({id: '1234', hash: 'hash', salt: 'salt'})
      hashifierCompareStub.resolves(true)
      loginStoreStub.create.resolves({id: '1234'})
      return userModel.login({userName: 'userName', password: 'password'})
        .then(id => {
          assert.equal(id, '1234')
          assert.equal(hashifierCompareStub.firstCall.args[0], 'password')
          assert.equal(hashifierCompareStub.firstCall.args[1], 'hash')
          assert.equal(hashifierCompareStub.firstCall.args[2], 'salt')
          assert.deepEqual(loginStoreStub.create.firstCall.args[0], {userId: '1234'})
        })
    })
  })

  describe('logout', () => {
    it('resolves with empty token', () =>
      userModel.logout()
    )
    it('removes the token', () => {
      loginStoreStub.remove.resolves(null)
      return userModel.logout('1234')
        .then(() => {
          assert.equal(loginStoreStub.remove.firstCall.args[0], '1234')
        })
    })
  })

  describe('register', () => {
    it('rejects if nothing provided', () =>
      userModel.register()
        .catch(err => {
          assert.equal(err.status, 400)
          assert.equal(err.message, 'invalid request')
        })
    )
    it('rejects if username not provided', () =>
      userModel.register({})
        .catch(err => {
          assert.equal(err.status, 400)
          assert.equal(err.message, 'invalid request')
        })
    )
    it('rejects if password not provided', () =>
      userModel.register({userName: 'test'})
        .catch(err => {
          assert.equal(err.status, 400)
          assert.equal(err.message, 'invalid request')
        })
    )
    it('hashes the password, creates a token and resolves to token id', () => {
      hashifierHashStub.resolves({hash: 'hash', salt: 'salt'})
      userStoreMethods.create.resolves({id: '1234'})
      loginStoreStub.create.resolves({id: '1234'})
      return userModel.register({userName: 'userName', password: 'password'})
        .then(id => {
          assert.equal(id, '1234')
          assert.equal(hashifierHashStub.firstCall.args[0], 'password')
          assert.deepEqual(userStoreMethods.create.firstCall.args[0], {
            hash: 'hash',
            salt: 'salt',
            roles: ['public'],
            userName: 'userName'
          })
          assert.deepEqual(loginStoreStub.create.firstCall.args[0], {
            userId: '1234'
          })
        })
    })
  })
})
