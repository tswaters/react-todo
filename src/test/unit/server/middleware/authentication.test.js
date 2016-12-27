

import * as sinon from 'sinon'
import 'sinon-as-promised'
import {agent} from 'supertest'

import appFactory from '../test-app'
import config from 'root/config-test.json'
import {UserModel} from 'server/lib/models'
import injector from 'inject?-express!server/lib/middleware/authentication'

describe('authentication middleware', () => {
  let client = null
  let server = null

  const model = sinon.createStubInstance(UserModel)

  before(done => {
    const {default: authMiddleware} = injector({
      'server/lib/models': {
        UserModel: sinon.stub().returns(model)
      }
    })

    const {app, context} = appFactory()
    const route = (req, res) => res.send(res.locals.user)
    context.get('/dummy', [authMiddleware(), route])
    context.get('/set-token', (req, res) => {
      req.session.token = '1234'
      res.send('ok')
    })

    client = agent(app)
    server = app.listen(config.port, done)
  })

  beforeEach(done => {
    client.get('/tests/clear-session').end(done)
  })

  afterEach(() => {
    model.authorize.reset()
  })

  after(done => {
    server.close(done)
  })


  it('throws unauthorized when no token present', done => {
    client.get('/dummy')
      .expect(401)
      .end(done)
  })

  it('sets res.locals.user to the related user', done => {
    model.authorize.resolves({id: '1234'})
    client.get('/set-token').end(err => {
      if (err) { return done(err) }
      client.get('/dummy')
        .expect(200, {id: '1234'})
        .end(done)
    })
  })

  it('returns errors to next', done => {
    model.authorize.rejects({status: 500, message: 'aw snap!'})
    client.get('/set-token').end(err => {
      if (err) { return done(err) }
      client.get('/dummy')
        .expect(500, {message: 'aw snap!'})
        .end(done)
    })
  })
})

