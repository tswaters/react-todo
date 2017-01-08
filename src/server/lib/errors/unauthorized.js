
export default class Unauthorized extends Error {
  constructor (...args) {
    super(...args)
    this.status = 401
  }
}
