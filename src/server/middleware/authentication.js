
import {UserModel} from 'server/models'
import {Unauthorized} from 'server/errors'

const userModel = new UserModel()

export default (required = true) => (req, res, next) => {
  const token = req.session.token || req.headers['x-token']

  if (!token && required) {
    return next(new Unauthorized('unauthorized'))
  } else if (!token) {
    return next()
  }

  userModel.authorize(token)
    .then(user => {
      res.locals.user = user
      next()
    })
    .catch(next)
}
