
import {UserStore, LoginTokenStore} from 'server/lib/stores'

import * as hashifier from 'hashifier'

export default class UserModel extends UserStore {

  constructor () {
    super()
    this.tokens = new LoginTokenStore()
    this.unauthorized = new Error('invalid user')
    this.unauthorized.status = 401
    this.badRequest = new Error('invalid request')
    this.badRequest.status = 400
  }

  /**
   * Verifies a token is valid and returns the relevant userId
   * @param {string} [token=null] token to authorize against
   * @returns {Promise<User>} resolves to use or throws unauthorized
   */
  authorize (token = null) {
    if (token == null) {
      return Promise.reject(this.badRequest)
    }
    return this.tokens.fetch(token)
      .then(loginToken => {
        if (!loginToken) { throw this.unauthorized }
        return loginToken.userId
      })
      .then(userId => this.fetch(userId))
      .then(user => {
        if (!user) { throw this.unauthorized }
        return user
      })
  }

  /**
   * Logs a user in, saves a login token for the user.
   * @param {string} userName username
   * @param {string} password plaintext password
   * @returns {Promise<User>} resovles to a user or throws unauthorized
   */
  login ({userName = null, password = null} = {}) {
    if (userName == null || password == null) {
      return Promise.reject(this.badRequest)
    }

    let userId = null

    return this.find(userName)
      .then(user => {
        if (!user) { throw this.unauthorized }
        userId = user.id
        return user
      })
      .then(user => hashifier.compare(password, user.hash, user.salt))
      .then(authorized => { if (!authorized) { throw this.unauthorized } })
      .then(() => this.tokens.create({userId}))
      .then(token => token.id)
  }

  /**
   * Logs a user out. Remove their login token.
   * @param {string} token id of the token.
   * @returns {Promoise<void>} resolves to undefined.
   */
  logout (token = null) {
    if (token == null) {
      return Promise.resolve()
    }

    return this.tokens.remove(token)
  }

  /**
   * Creates a new user in the system, and a login token.
   * @param {*} payload as provided by req.body
   * @param {string} username name of the user to create
   * @param {string} password plaintext password to be hashed
   * @returns {Promise<string>} resolves to id of login token
   */
  register ({userName = null, password = null} = {}) {
    if (userName == null || password == null) {
      return Promise.reject(this.badRequest)
    }

    const roles = ['public']

    return hashifier.hash(password)
      .then(({hash, salt}) => this.create({userName, salt, hash, roles}))
      .then(user => this.tokens.create({userId: user.id}))
      .then(token => token.id)
  }
}
