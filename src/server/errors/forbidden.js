
export default class Forbidden extends Error {
  constructor (...args) {
    super(...args)
    this.status = 403
  }
}
