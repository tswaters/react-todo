
import {UserModel} from 'server/lib/models'

const userModel = new UserModel()

export default () => (req, res, next) => {
  const token = req.session.token
  const unauthorized = new Error('unauthorized')

  unauthorized.status = 401
  if (!token) {
    return next(unauthorized)
  }

  userModel.authorize(req.session.token)
    .then(user => {
      res.locals.user = user
      next()
    })
    .catch(next)
}
