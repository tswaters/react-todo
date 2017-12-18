
import {Unauthorized} from 'server/errors'
import UserModel from 'server/models/user'

export default (required = true) => async (req, res, next) => {
  const token = req.session.token || req.headers['x-token']
  const logger = req.app.locals.logger

  try {
    if (!token && required) {
      throw new Unauthorized('unauthorized')
    } else if (!token) {
      return next()
    }

    const user = await UserModel.authorize(token)
    logger.chindings += `,"user":"${user.id}"`
    res.locals.user = user
    next()
  } catch (err) {
    next(err)
  }
}
