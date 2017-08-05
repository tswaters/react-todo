
import {BadRequest} from 'server/errors'
import {TodoStore} from 'server/stores'

class TodoModel extends TodoStore {

  create ({text = null} = {}) {
    if (text == null || typeof text !== 'string' || text.trim() === '') {
      return Promise.reject(new BadRequest('text must be provided'))
    }
    return super.create({text})
  }

}

export default TodoModel
