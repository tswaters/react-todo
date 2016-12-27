
export default (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  const {message, stack, status = 500} = err
  res.status(status).send({message, stack})
}
