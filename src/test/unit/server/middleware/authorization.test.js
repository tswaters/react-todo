

import * as sinon from 'sinon'
import 'sinon-as-promised'
import {agent} from 'supertest'

import appFactory from '../test-app'
import authMiddleware from 'server/middleware/authorization'

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

  it('undefined roles equates to 403', done => {
    roleStub.returns(authMiddleware('role'))
    userStub.returns({id: '1234'})
    client
      .get('/dummy')
      .expect(403)
      .end(done)
  })

  it('no roles equates to 403', done => {
    roleStub.returns(authMiddleware('role'))
    userStub.returns({id: '1234', roles: []})
    client
      .get('/dummy')
      .expect(403)
      .end(done)
  })

  it('missing role equotes to 403', done => {
    roleStub.returns(authMiddleware('role'))
    userStub.returns({id: '1234', roles: ['nope']})
    client
      .get('/dummy')
      .expect(403)
      .end(done)
  })

  it('returns next properly - string role', done => {
    roleStub.returns(authMiddleware('role'))
    userStub.returns({id: '1234', roles: ['role']})
    client
      .get('/dummy')
      .expect(200, {ok: true})
      .end(done)
  })

  it('returns next properly - array roles', done => {
    roleStub.returns(authMiddleware(['role']))
    userStub.returns({id: '1234', roles: ['role']})
    client
      .get('/dummy')
      .expect(200, {ok: true})
      .end(done)
  })
})

