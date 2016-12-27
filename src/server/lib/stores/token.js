
import Store from './store'

/**
 * Retrieves an updated expiry date for a login token.
 * @param {Date} [date] date it is expiring
 * @returns {Date} updated expiry
 */
const getExpiry = date => {
  date = date ? new Date(date) : new Date()
  date.setDate(date.getDate() + 1)
  return date.getTime()
}

/**
 * @class LoginTokenStore
 * @description Model for the todos, supports simple crud operations.
 */
class LoginTokenStore extends Store {

  /**
   * Call into the constructor with the table name.
   */
  constructor () {
    super('login')
  }

  /**
   * Overload the list method for login tokens to fail.
   * No one should be able to do this.
   * @returns {Promise<void>} rejects an error.
   */
  list () {
    return Promise.reject(new Error('no.'))
  }

  /**
   * When fetching, ensure the expiry hasn't been reached
   * If not exists, resolve empty object
   * If expired, remove token & resolve empty object
   * If everything appears ok, update with new expiry & resolve the token.
   * @param {string} id id of the token.
   * @returns {Promise<Token|void>} resolvecs to token or undefined if not set.
   */
  fetch (id) {
    return super.fetch(id)
      .then(token => {
        if (!token) {
          return Promise.resolve()
        }
        else if (token.expiry < new Date()) {
          return this.remove(id).then(() => null)
        }
        return this.update(id, token)
      })
  }

  /**
   * Ensure the expiry date is set when create is called
   * @param {*} body of the token (expecting userId)
   * @returns {Promise<Token|void>} resolves upon success
   */
  create (body) {
    body.expiry = getExpiry()
    return super.create(body)
  }

  /**
   * Ensure the expiry date is updated when update is called
   * @param {string} id if of the token to update.
   * @param {*} body body of the token (expecting userId)
   * @returns {Promise<Token|void>} resolves upon success
   */
  update (id, body) {
    body.expiry = getExpiry(body.expiry)
    return super.update(id, body)
  }

}

export default LoginTokenStore

