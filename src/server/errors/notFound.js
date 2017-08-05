
export default class NotFound extends Error {
  constructor (...args) {
    super(...args)
    this.status = 404
  }
}
