
import * as sinon from 'sinon'
import {agent} from 'supertest'
import proxyquire from 'proxyquire'
import appFactory from 'test/unit/server/test-app'

const {
  PORT = 3001
} = process.env

describe('authentication middleware', () => {
  let client = null
  let server = null
  let authMiddleware = null
  let context = null

  const authorize = sinon.stub()

  beforeEach(done => {
    authMiddleware = proxyquire('server/middleware/authentication', {
      'server/models/user': {default: {authorize}}
    }).default

    const {app, context: _context} = appFactory()
    context = _context

    _context.get('/set-token', (req, res) => {
      req.session.token = '1234'
      res.send('ok')
    })

    client = agent(app)
    server = app.listen(PORT, done)
  })

  afterEach(done => {
    authorize.reset()
    server.close(done)
  })

  describe('auth required', () => {
    beforeEach(() => {
      context.get('/dummy', [authMiddleware(), (req, res) => res.send(res.locals.user)])
    })

    it('throws unauthorized when no token present', () => {
      return client.get('/dummy').expect(401)
    })

    it('sets res.locals.user to the related user', async () => {
      authorize.resolves({id: '1234'})
      await client.get('/set-token')
      await client.get('/dummy').expect(200, {id: '1234'})
    })

    it('returns errors to next', async () => {
      authorize.rejects({status: 500, message: 'aw snap!'})
      await client.get('/set-token')
      await client.get('/dummy').expect(500, {status: 500, message: 'aw snap!'})
    })
  })

  describe('auth not required', () => {
    beforeEach(() => {
      context.get('/dummy', [authMiddleware(false), (req, res) => res.send({})])
    })

    it('should be ok if token not found', async () => {
      await client.get('/dummy').expect(200, {})
    })
  })

})

