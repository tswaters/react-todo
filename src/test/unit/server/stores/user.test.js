
import * as assert from 'assert'
import * as sinon from 'sinon'
import 'sinon-as-promised'

import Store from 'server/stores/store'
import injector from 'inject-loader!server/stores/user'

describe('user store', () => {
  let UserStore = null
  let userStore = null

  const storeMethods = sinon.createStubInstance(Store)
  const storeStub = sinon.stub()
  Object.setPrototypeOf(storeStub.prototype, storeMethods)

  before(() => {
    UserStore = injector({
      './store': storeStub
    }).default
  })

  beforeEach(() => {
    userStore = new UserStore()
    userStore.data = [
      {userName: 'test1'},
      {userName: 'test2'},
      {userName: 'test3'}
    ]
  })

  describe('#find', () => {
    it('should return users properly', () => {
      storeMethods.load.resolves()
      userStore.find('test1')
        .then(user => {
          assert.deepEqual(user, {userName: 'test1'})
        })
    })
  })
})

