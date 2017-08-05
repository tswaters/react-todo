
export default class BadRequest extends Error {
  constructor (...args) {
    super(...args)
    this.status = 400
  }
}
