
'use strict'

module.exports = {
  up (queryInterface, Sequelize) {
    return Promise.resolve()
      .then(() =>
        queryInterface.createTable('roles', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING
          }
        })
      )
      .then(() =>
        queryInterface.createTable('users', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
          },
          userName: {
            allowNull: false,
            type: Sequelize.STRING
          },
          hash: {
            allowNull: false,
            type: Sequelize.STRING
          },
          salt: {
            allowNull: false,
            type: Sequelize.STRING
          }
        })
      )
      .then(() =>
        queryInterface.createTable('userRoles', {
          userId: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            references: {
              model: 'users',
              field: 'id'
            }
          },
          roleId: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
            references: {
              model: 'roles',
              field: 'id'
            }
          }
        })
      )
      .then(() =>
        queryInterface.createTable('todos', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
          },
          userId: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
              model: 'users',
              field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
          },
          text: {
            allowNull: false,
            type: Sequelize.STRING
          }
        })
      )
  },
  down (queryInterface) {
    return Promise.resolve()
      .then(() => queryInterface.dropTable('users'))
      .then(() => queryInterface.dropTable('todos'))
  }
}
