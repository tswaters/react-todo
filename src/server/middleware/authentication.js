
import {Unauthorized} from 'server/errors'
import UserModel from 'server/models/user'

export default (required = true) => (req, res, next) => {
  const token = req.session.token || req.headers['x-token']

  if (!token && required) {
    return next(new Unauthorized('unauthorized'))
  } else if (!token) {
    return next()
  }

  UserModel.authorize(token)
    .then(user => {
      res.locals.user = user
      next()
    })
    .catch(next)
}
