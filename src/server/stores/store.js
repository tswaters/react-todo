
import * as path from 'path'
import fs from 'fs-extra'
import uuid from 'uuid'

import {NotFound} from 'server/errors'

/**
 * @class TodoModel
 * @description Model for the todos, supports simple crud operations.
 * @todo Update to use something other than file-system, JSON datastore
 */
class DataStore {

  constructor (table) {
    this.path = path.resolve(`${process.env.DATA_PATH}/${table}/data.json`)
  }

  initialize () {
    this.data = []
    return new Promise((resolve, reject) => {
      fs.outputJSON(this.path, this.data, err => {
        if (err) { return reject(err) }
        resolve()
      })
    })
  }

  /**
   * Loads the data store from the filesystem.
   * @returns {Promise<void>} promise
   */
  load () {
    return new Promise((resolve, reject) => {
      fs.readJSON(this.path, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
          return this.initialize().then(resolve, reject)
        }
        if (err) {
          return reject(err)
        }
        this.data = data
        resolve()
      })
    })
  }

  /**
   * Loads the data store to the filesystem.
   * @returns {Promise<void>} promise
   */
  save () {
    return new Promise((resolve, reject) => {
      fs.outputJSON(this.path, this.data, err => {
        if (err) { return reject(err) }
        resolve()
      })
    })
  }

  /**
   * Retrieves a list of all the todos loaded from persistent storage.
   * @todo pagination, filtering, sorting
   * @returns {Promise<Todo[]>} array of todos
   */
  list () {
    return this.load()
      .then(() => this.data)
  }

  /**
   * Retrieves a todo  by id from persistent storage.
   * @param {string} id the uuid of the todo to fetch.
   * @returns {Promise<Todo|void>} todo; resolves to undefined if not found.
   */
  fetch (id) {
    return this.load()
      .then(() => this.data.find(item => item.id === id))
      .then(item => {
        if (!item) { throw new NotFound('could not find todo') }
        return item
      })
  }

  /**
   * Creates a new todo and persists it to persistent storage.
   * @param {Todo} body the todo to save; id will be generated.
   * @returns {Promise<Todo>} created todo with id.
   */
  create (body) {
    body.id = uuid.v4()
    return this.load()
      .then(() => this.data.push(body))
      .then(() => this.save())
      .then(() => body)
  }

  /**
   * Updates a todo and saves to persistent storage.
   * @param {string} id the uuid of the todo to fetch.
   * @param {Todo} body the new todo's body
   * @returns {Promise<Item|void>} promise; resolves to undefined if not found
   */
  update (id, body) {
    let updated = null
    return this.load()
      .then(() =>
        this.data = this.data.map(item =>
          item.id === id ? updated = Object.assign({}, item, body) : item
        )
      )
      .then(() => {
        if (!updated) {
          throw new NotFound('could not find todo')
        }
      })
      .then(() => this.save())
      .then(() => updated)
  }

  /**
   * Removes a todo from persistent storage
   * @param {string} id the uuid fo the todo to remove
   * @returns {Promise<void>} promise; can resolve to undefined if not found.
   */
  remove (id) {
    return this.load()
      .then(() => this.data.filter(item => item.id !== id))
      .then(data => {
        if (data.length === this.data.length) {
          throw new NotFound('could not find todo')
        }
        this.data = data
      })
      .then(() => this.save())
      .then(() => ({id}))
  }

}

export default DataStore
