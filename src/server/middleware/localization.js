
export default (req, res, next) => {
  req.locale = 'en'
  next()
}
