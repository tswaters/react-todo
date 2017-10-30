
import logger from 'server/logger'

export default () => (req, res, next) => {
  req.app.locals.logger = logger.child({sid: req.session.id, type: 'app'})
  next()
}
