
import * as assert from 'assert'
import * as sinon from 'sinon'
import 'sinon-as-promised'

import Store from 'server/stores/store'
import injector from 'inject-loader?-path!server/stores/token'

describe('token store', () => {
  let clock = null
  let TokenStore = null
  let tokenStore = null

  const storeMethods = sinon.createStubInstance(Store)
  const storeStub = sinon.stub()
  Object.setPrototypeOf(storeStub.prototype, storeMethods)

  before(() => {
    clock = sinon.useFakeTimers(new Date(2016, 0, 1).getTime())
    TokenStore = injector({
      './store': storeStub
    }).default
  })

  beforeEach(() => {
    tokenStore = new TokenStore()
  })

  afterEach(() => {
    storeMethods.fetch.reset()
    storeMethods.remove.reset()
    storeMethods.update.reset()
    storeMethods.create.reset()
  })

  after(() => {
    clock.restore()
  })

  describe('#list', () => {
    it('should reject', () =>
      tokenStore.list()
        .catch(err => {
          assert.equal(err.message, 'no.')
        })
    )
  })

  describe('#fetch', () => {
    it('should resolve empty if token not found', () => {
      storeMethods.fetch.resolves(null)
      return tokenStore.fetch('1234')
        .then(token => {
          assert.equal(token, null)
        })
    })
    it('should remove token and resolve empty if token expired', () => {
      storeMethods.fetch.resolves({expiry: new Date(2015, 0, 1).getTime()})
      storeMethods.remove.resolves(null)
      return tokenStore.fetch('1234')
        .then(token => {
          assert.equal(token, null)
          assert.equal(storeMethods.remove.firstCall.args[0], '1234')
        })
    })
    it('should call into update and resolve its value', () => {
      const dummyToken = {expiry: new Date(2016, 0, 2).getTime()}
      storeMethods.fetch.resolves(dummyToken)
      const updateStub = sinon.stub(tokenStore, 'update').resolves({})
      return tokenStore.fetch('1234')
        .then(token => {
          assert.deepEqual(token, {})
          assert.equal(updateStub.firstCall.args[0], '1234')
          assert.equal(updateStub.firstCall.args[1], dummyToken)
          updateStub.restore()
        })
    })
  })

  describe('#update', () => {
    it('should update expiry and call into super class', () => {
      const expected = new Date()
      expected.setDate(expected.getDate() + 1)
      storeMethods.create.resolves({})
      return tokenStore.create({})
        .then(() => {
          const {expiry} = storeMethods.create.firstCall.args[0]
          assert.equal(expiry, expected.getTime())
        })
    })
  })

  describe('#create', () => {
    it('should set expiry and call into super class', () => {
      const expiry = new Date(2016, 1, 1)
      const payload = {expiry}
      const expected = new Date(expiry.getTime())
      expected.setDate(expected.getDate() + 1)
      storeMethods.update.resolves({})
      return tokenStore.update('1234', payload)
        .then(() => {
          assert.equal(storeMethods.update.firstCall.args[0], '1234')
          const {expiry: actual} = storeMethods.update.firstCall.args[1]
          assert.equal(actual, expected.getTime())
        })
    })
  })
})

