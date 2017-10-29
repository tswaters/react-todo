
import * as assert from 'assert'
import * as sinon from 'sinon'

import injector from 'inject-loader?-path!server/stores/store'

describe('the store', () => {
  let Store = null
  let store = null

  const path = './some-path.json'
  const data = [{id: '1234', data: 'yay'}]

  // Chosen by fair die roll
  const uuidStub = sinon.stub().returns(4)
  const readJSON = sinon.stub()
  const outputJSON = sinon.stub()

  before(() => {
    Store = injector({
      'fs-extra': {readJSON, outputJSON},
      uuid: {v4: uuidStub}
    }).default
  })

  beforeEach(() => {
    store = sinon.createStubInstance(Store)
    store.path = path
    store.data = [].slice.call(data)
  })

  afterEach(() => {
    readJSON.reset()
    outputJSON.reset()
  })

  describe('#load', () => {
    beforeEach(() => {
      store.load.restore()
    })
    it('should call initialize if nothing found', () => {
      readJSON.callsArgWith(2, {code: 'ENOENT'})
      store.initialize.resolves()
      return store.load()
        .then(() => {
          assert.equal(store.initialize.callCount, 1)
        })
    })
    it('should respond to errors', () => {
      readJSON.callsArgWith(2, new Error('aw snap!'))
      return store.load()
        .catch(err => {
          assert.equal(err.message, 'aw snap!')
        })
    })
    it('should parse the json properly', () => {
      readJSON.callsArgWith(2, null, {123: '456'})
      return store.load()
        .then(() => {
          assert.equal(readJSON.firstCall.args[0], path)
          assert.equal(readJSON.firstCall.args[1], 'utf8')
          assert.deepEqual(store.data, {123: '456'})
        })
    })
  })
  describe('#save', () => {
    beforeEach(() => {
      store.save.restore()
    })
    it('should respond to errors properly', () => {
      outputJSON.callsArgWith(2, new Error('aw snap'))
      return store.save()
        .catch(err => {
          assert.equal(err.message, 'aw snap')
        })
    })
    it('should resolve when saved properly', () => {
      outputJSON.callsArgWith(2, null, {})
      return store.save()
        .then(() => {
          assert.equal(outputJSON.firstCall.args[0], path)
          assert.deepEqual(outputJSON.firstCall.args[1], data)
        })
    })
  })
  describe('#list', () => {
    beforeEach(() => {
      store.list.restore()
    })
    it('should return data properly', () => {
      store.load.resolves()
      return store.list()
        .then(result => {
          assert.deepEqual(result, data)
        })
    })
  })
  describe('#fetch', () => {
    beforeEach(() => {
      store.fetch.restore()
    })
    it('should return a given object by id properly', () => {
      const id = data[0].id
      store.load.resolves()
      return store.fetch(id)
        .then(result => {
          assert.deepEqual(result, data[0])
        })
    })
  })
  describe('#create', () => {
    beforeEach(() => {
      store.create.restore()
    })
    it('should save a new record properly', () => {
      store.load.resolves()
      store.save.resolves()
      return store.create({data: 'yes!'})
        .then(result => {
          assert.deepEqual(result, {id: 4, data: 'yes!'}, 'result not returned')
          assert.deepEqual(store.data[1], {id: 4, data: 'yes!'}, 'data not saved')
        })
    })
  })
  describe('#update', () => {
    beforeEach(() => {
      store.update.restore()
    })
    it('should update an existing record properly', () => {
      store.load.resolves()
      store.save.resolves()
      return store.update('1234', {data: 'no!'})
        .then(result => {
          assert.deepEqual(result, {id: '1234', data: 'no!'}, 'result not returned')
          assert.deepEqual(store.data[0], {id: '1234', data: 'no!'}, 'data not saved')
        })
    })
  })
  describe('#remove', () => {
    beforeEach(() => {
      store.remove.restore()
    })
    it('should remove an existing record', () => {
      store.load.resolves()
      store.save.resolves()
      return store.remove('1234')
        .then(() => {
          assert.deepEqual(store.data, {})
        })
    })
  })
})

