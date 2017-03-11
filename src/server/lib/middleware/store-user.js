
export default () => (req, res, next) => {
  const user = res.locals.user
  if (!user) { return next() }

  res.locals.state.user = {
    userName: user.userName,
    id: user.id
  }

  next()
}
