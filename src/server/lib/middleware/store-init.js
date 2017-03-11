
export default () => (req, res, next) => {
  res.locals.state = {}
  next()
}
