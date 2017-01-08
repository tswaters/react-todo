
import {BadRequest} from 'server/lib/errors'
import {TodoStore} from 'server/lib/stores'

class TodoModel extends TodoStore {

  create ({text = null} = {}) {
    if (text == null || typeof text !== 'string' || text.trim() === '') {
      return Promise.reject(new BadRequest('text must be provided'))
    }
    return super.create({text})
  }

}

export default TodoModel
