
import * as assert from 'assert'
import * as async from 'async'
import {agent} from 'supertest'
import app from 'server/app'

const {PORT = 3001} = process.env

describe('todo-lifecycle integration test', () => {
  const user1 = {userName: 'test1', password: 'test'}
  const user2 = {userName: 'test2', password: 'test'}
  const newTodo = {text: 'Learn react!'}
  const updatedTodo = {text: 'Learn react!'}

  let client = null
  let server = null

  before(done => {
    client = agent(app)
    server = app.listen(PORT, done)
  })

  after(done => {
    server.close(done)
  })

  it('should work properly', done => {
    let id1 = null
    let id2 = null

    async.series([

      // Register
      next => client.post('/api/auth/register').send(user1).expect(200).end(next),

      // Create todos
      next => client.post('/api/todo').send(newTodo).expect(200).end(next),
      next => client.post('/api/todo').send(newTodo).expect(200).end(next),

      // List todo
      next => client.get('/api/todo').expect(200).end((err, res) => {
        if (err) { return next(err) }
        assert.equal(res.body.length, 2)
        // Save id for later
        id1 = res.body[0].id
        id2 = res.body[1].id
        next()
      }),
      // Update todo
      next => client.put(`/api/todo/${id1}`).send(updatedTodo).expect(200).end(next),

      // Fetch todo
      next => client.get(`/api/todo/${id1}`).expect(200, Object.assign({}, updatedTodo, {id: id1})).end(next),

      // Delete todo
      next => client.delete(`/api/todo/${id1}`).expect(200).end(next),

      // Fetch todo (should be gone)
      next => client.get(`/api/todo/${id1}`).expect(404).end(next),

      // Logout
      next => client.post('/api/auth/logout').expect(200).end(next),

      // Attempt to create, should fail
      next => client.post('/api/todo').send(newTodo).expect(401).end(next),

      // Register as different user
      next => client.post('/api/auth/register').send(user2).expect(200).end(next),

      // Attempt to act upon the existing user's todos, should be 404
      next => client.get(`/api/todo/${id2}`).expect(404).end(next),
      next => client.delete(`/api/todo/${id2}`).expect(404).end(next),
      next => client.put(`/api/todo/${id2}`).expect(404).end(next),

      // Logout
      next => client.post('/api/auth/logout').expect(200).end(next),

      // Login (again)
      next => client.post('/api/auth/login').send(user1).expect(200).end(next),

      // Make sure we can still get one of the todos
      next => client.get(`/api/todo/${id2}`).expect(200, Object.assign({}, newTodo, {id: id2})).end(next)

    ], done)
  })
})
