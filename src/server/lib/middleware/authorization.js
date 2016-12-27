
export default roles => {
  if (!Array.isArray(roles)) {
    roles = [roles]
  }

  return (req, res, next) => {
    const user = res.locals.user
    const forbidden = new Error('forbidden')

    forbidden.status = 403

    if (!Array.isArray(user.roles) || user.roles.length < roles.length) {
      throw forbidden
    }

    if (!user.roles.some(item => roles.indexOf(item) > -1)) {
      throw forbidden
    }

    next()
  }
}
