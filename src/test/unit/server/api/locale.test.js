
import supertest from 'supertest'
import * as assert from 'assert'
import proxyquire from 'proxyquire'
import appFactory from 'test/unit/server/test-app'

const {
  PORT = 3001
} = process.env

describe('locale controller', () => {
  let client = null
  let server = null

  before(done => {
    const localeController = proxyquire('server/api/locale', {
      'i18n/en': {key1: 'value1'},
      'server/middleware/authentication': {default: () => (req, res, next) => next()},
    }).default
    const {app, context} = appFactory()
    context.use('/api/locale', localeController)
    client = supertest(app)
    server = app.listen(PORT, done)
  })

  after(done => {
    server.close(done)
  })

  describe('default', () => {

    it('should return bad request if messages not provided', async () => {
      const res = await client.post('/api/locale').expect(400)
      assert.deepEqual(res.body.message, 'messages must be provided')
    })

    it('should return messages properly', async () => {
      const res = await client.post('/api/locale').send({messages: ['key1']})
      assert.deepEqual(res.body, {
        messages: {
          key1: 'value1'
        }
      })
    })

  })

})
