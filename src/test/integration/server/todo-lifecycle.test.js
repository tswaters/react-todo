
import * as assert from 'assert'
import {agent} from 'supertest'
import app from 'server/app'

const {PORT = 3001} = process.env

describe('todo-lifecycle integration test', function () {
  this.timeout(5000)
  const user1 = {userName: 'test1', password: 'test'}
  const user2 = {userName: 'test2', password: 'test'}
  const newTodo = {text: 'Learn react!'}
  const updatedTodo = {text: 'No seriously, learn react!'}

  let client = null
  let server = null

  before(done => {
    client = agent(app)
    server = app.listen(PORT, done)
  })

  after(done => {
    server.close(done)
  })

  it('should work properly', async () => {
    let id1 = null
    let id2 = null

    // Register
    await client.post('/api/auth/register').send(user1).expect(200)

    // Create todos
    await client.post('/api/todo').send(newTodo).expect(200)
    await client.post('/api/todo').send(newTodo).expect(200)

    // List todo
    const todoList = await client.get('/api/todo').expect(200)
    assert.equal(todoList.body.length, 2)
    // Save id for later
    id1 = todoList.body[0].id
    id2 = todoList.body[1].id

    // Update todo
    await client.put(`/api/todo/${id1}`).send(updatedTodo).expect(200)

    // Fetch todo
    await client.get(`/api/todo/${id1}`).expect(200, Object.assign({}, updatedTodo, {id: id1}))

    // Delete todo
    await client.delete(`/api/todo/${id1}`).expect(200)

    // Fetch todo (should be gone)
    await client.get(`/api/todo/${id1}`).expect(404)

    // Logout
    await client.post('/api/auth/logout').expect(200)

    // Attempt to create, should fail
    await client.post('/api/todo').send(newTodo).expect(401)

    // Register as different user
    await client.post('/api/auth/register').send(user2).expect(200)

    // Attempt to act upon the existing user's todos, should be 404
    await client.get(`/api/todo/${id2}`).expect(404)
    await client.delete(`/api/todo/${id2}`).expect(404)
    await client.put(`/api/todo/${id2}`).send(updatedTodo).expect(404)

    // Logout
    await client.post('/api/auth/logout').expect(200)

    // Login (again)
    await client.post('/api/auth/login').send(user1).expect(200)

    // Make sure we can still get one of the todos
    await client.get(`/api/todo/${id2}`).expect(200, Object.assign({}, newTodo, {id: id2}))
  })
})
