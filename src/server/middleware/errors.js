
export default (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  const {message, stack, status = 500} = err
  req.app.locals.logger.error(err)
  res.status(status).send({status, message, stack})
}
