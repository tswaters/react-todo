
import path from 'path'
import Store from './store'

/**
 * @class TodoStore
 * @description Model for the todos, supports simple crud operations.
 */
class TodoStore extends Store {

  /**
   * Call into the constructor with the table name.
   * @param {string} userId update path to use specific userId
   */
  constructor (userId) {
    super('todos')
    this.path = `${path.dirname(this.path)}/${userId}.json`
  }

}

export default TodoStore
