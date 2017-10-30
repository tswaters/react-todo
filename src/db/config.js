const Sequelize = require('sequelize')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'data/database-dev.sqlite',
    seederStorage: 'sequelize',
    operatorsAliases: Sequelize.Op
  },
  test: {
    dialect: 'sqlite',
    storage: 'data/database-test.sqlite',
    seederStorage: 'sequelize',
    logging: false,
    operatorsAliases: Sequelize.Op
  },
  production: {
    dialect: 'sqlite',
    storage: 'data/database-prod.sqlite',
    seederStorage: 'sequelize',
    operatorsAliases: Sequelize.Op
  }
}
