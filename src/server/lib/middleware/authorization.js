
import {Forbidden} from 'server/lib/errors'

export default roles => {
  if (!Array.isArray(roles)) {
    roles = [roles]
  }

  return (req, res, next) => {
    const user = res.locals.user

    if (!Array.isArray(user.roles) || user.roles.length < roles.length) {
      throw new Forbidden()
    }

    if (!user.roles.some(item => roles.indexOf(item) > -1)) {
      throw new Forbidden()
    }

    next()
  }
}
