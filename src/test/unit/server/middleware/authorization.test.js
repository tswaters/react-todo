

import * as sinon from 'sinon'
import {agent} from 'supertest'
import authMiddleware from 'server/middleware/authorization'
import appFactory from 'test/unit/server/test-app'

const {
  PORT = 3001
} = process.env

describe('authentication middleware', () => {
  let client = null
  let server = null

  const roleStub = sinon.stub()
  const userStub = sinon.stub()

  before(done => {
    const {app, context} = appFactory()

    context.get('/dummy', [
      (req, res, next) => {
        res.locals.user = userStub()
        next()
      },
      (req, res, next) => roleStub()(req, res, next),
      (req, res) => res.json({ok: true})
    ])

    client = agent(app)
    server = app.listen(PORT, done)
  })

  afterEach(() => {
    roleStub.reset()
    userStub.reset()
  })

  after(done => {
    server.close(done)
  })

  it('undefined roles equates to 403', async () => {
    roleStub.returns(authMiddleware('role'))
    userStub.returns({id: '1234'})
    await client.get('/dummy').expect(403)
  })

  it('no roles equates to 403', async () => {
    roleStub.returns(authMiddleware('role'))
    userStub.returns({id: '1234', roles: []})
    await client.get('/dummy').expect(403)
  })

  it('missing role equotes to 403', async () => {
    roleStub.returns(authMiddleware('role'))
    userStub.returns({id: '1234', roles: [{id: 'nope'}]})
    await client.get('/dummy').expect(403)
  })

  it('returns next properly - string role', async () => {
    roleStub.returns(authMiddleware('role'))
    userStub.returns({id: '1234', roles: [{id: 'role'}]})
    await client.get('/dummy').expect(200, {ok: true})
  })

  it('returns next properly - array roles', async () => {
    roleStub.returns(authMiddleware(['role']))
    userStub.returns({id: '1234', roles: [{id: 'role'}]})
    await client.get('/dummy').expect(200, {ok: true})
  })
})

