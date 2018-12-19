const path = require('path')
const Sequelize = require('sequelize')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), 'data/database-dev.sqlite'),
    seederStorage: 'sequelize',
    operatorsAliases: Sequelize.Op
  },
  test: {
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), 'data/database-test.sqlite'),
    seederStorage: 'sequelize',
    logging: false,
    operatorsAliases: Sequelize.Op
  },
  production: {
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), 'data/database-prod.sqlite'),
    seederStorage: 'sequelize',
    operatorsAliases: Sequelize.Op
  }
}
