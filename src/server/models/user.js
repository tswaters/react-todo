
import {BadRequest, Unauthorized} from 'server/errors'
import {UserStore, LoginTokenStore} from 'server/stores'

import * as hashifier from 'hashifier'

export default class UserModel extends UserStore {

  constructor () {
    super()
    this.tokens = new LoginTokenStore()
  }

  changePassword (user, {oldPassword, newPassword}) {
    if (oldPassword == null || typeof oldPassword !== 'string' || oldPassword.trim() === '') {
      return Promise.reject(new BadRequest('old password must be provided'))
    }

    if (newPassword == null || typeof newPassword !== 'string' || newPassword.trim() === '') {
      return Promise.reject(new BadRequest('new password must be provided'))
    }

    return hashifier.compare(oldPassword, user.hash, user.salt)
      .then(authorized => {
        if (!authorized) { throw new Unauthorized('incorrect password') }
        return hashifier.hash(newPassword)
      })
      .then(({hash, salt}) => this.update(user.id, {hash, salt}))
  }

  /**
   * Verifies a token is valid and returns the relevant userId
   * @param {string} [token=null] token to authorize against
   * @returns {Promise<User>} resolves to use or throws unauthorized
   */
  authorize (token = null) {
    if (token == null || typeof token !== 'string' || token.trim() === '') {
      return Promise.reject(new BadRequest('token must be provided'))
    }
    return this.tokens.fetch(token)
      .then(loginToken => {
        if (!loginToken) { throw new Unauthorized('login token not found') }
        return loginToken.userId
      })
      .then(userId => this.fetch(userId))
      .then(user => {
        if (!user) { throw new Unauthorized('user not found') }
        return {...user, token}
      })
  }

  /**
   * Logs a user in, saves a login token for the user.
   * @param {string} userName username
   * @param {string} password plaintext password
   * @returns {Promise<User>} resovles to a user or throws unauthorized
   */
  login ({userName = null, password = null} = {}) {
    if (userName == null || typeof userName !== 'string' || userName.trim() === '') {
      return Promise.reject(new BadRequest('userName must be provided'))
    }
    if (password == null || typeof password !== 'string' || password.trim() === '') {
      return Promise.reject(new BadRequest('password must be provided'))
    }

    let user = null
    let userId = null

    return this.find(userName)
      .then(_user => {
        if (!_user) { throw new Unauthorized('user not found') }
        user = _user
        userId = user.id
        return user
      })
      .then(() => hashifier.compare(password, user.hash, user.salt))
      .then(authorized => { if (!authorized) { throw new Unauthorized('user not found') } })
      .then(() => this.tokens.create({userId}))
      .then(token => ({...user, token: token.id}))
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
    if (userName == null || typeof userName !== 'string' || userName.trim() === '') {
      return Promise.reject(new BadRequest('userName must be provided'))
    }

    if (password == null || typeof password !== 'string' || password.trim() === '') {
      return Promise.reject(new BadRequest('password must be provided'))
    }

    const roles = ['public']

    return this.find(userName)
      .then(user => {
        if (user) { throw new BadRequest('userName already in use!') }
      })
      .then(() => hashifier.hash(password))
      .then(({hash, salt}) => this.create({userName, salt, hash, roles}))
      .then(user => this.tokens.create({userId: user.id}))
      .then(token => token.id)
  }
}
