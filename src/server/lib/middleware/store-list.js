
import {TodoModel} from 'server/lib/models'

export default () => (req, res, next) => {
  if (!res.locals.user) { return next() }

  new TodoModel(res.locals.user.id).list()
    .then(list => {
      res.locals.state.list = list
      next()
    })
    .catch(next)
}
