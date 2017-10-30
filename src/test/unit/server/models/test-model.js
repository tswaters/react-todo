
import sinon from 'sinon'

/**
 * This is kind of greasy and will break if sequelize changes their internal structure
 * This creates a stubbed model instance with the internal data structure all setup
 * Each of the methods (save, destroy, etc.) will be stubbed, except `get` and `toJSON`
 * setters/getters are setup to update `dataValues` for each attribute provided
 * @param {Sequelize.Model} model model to work against
 * @param {string[]} attrs array of attributes in the model
 * @returns {function} factory function accepting initial data
 */
export default (model, attrs) => payload => {
  const result = sinon.createStubInstance(model)
  result._options = {include: false} // Normally set in constructor
  result.toJSON.callThrough()
  result.get.callThrough()
  result.dataValues = payload
  Object.defineProperties(result, attrs.reduce((memo, item) => {
    memo[item] = {
      set (value) { this.dataValues[item] = value },
      get () { return this.dataValues[item] }
    }
    return memo
  }, {}))
  return result
}
