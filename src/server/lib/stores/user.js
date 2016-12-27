
import Store from './store'

class UserStore extends Store {

  constructor () {
    super('users')
  }

  /**
   * Searches the users for one with the given userName
   * @param {string} userName name of the user to search for.
   * @returns {Promise<User>} resolves to use (or undefined!)
   */
  find (userName) {
    return this.load()
      .then(() => this.data.find(user => user.userName === userName))
  }

}

export default UserStore
