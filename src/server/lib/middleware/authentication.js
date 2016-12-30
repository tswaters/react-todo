
import {UserModel} from 'server/lib/models'

const userModel = new UserModel()

export default (required = true) => (req, res, next) => {
  const token = req.session.token
  const unauthorized = new Error('unauthorized')

  unauthorized.status = 401
  if (!token && required) {
    return next(unauthorized)
  }
  else if (!token) {
    return next()
  }

  userModel.authorize(req.session.token)
    .then(user => {
      res.locals.user = user
      next()
    })
    .catch(next)
}
