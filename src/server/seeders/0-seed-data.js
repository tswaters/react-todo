
'use strict'

const uuid = require('uuid')
const hashifier = require('hashifier')

module.exports = {
  up (queryInterface, Sequelize) {
    const adminId = uuid.v4()
    const tylerId = uuid.v4()
    return Promise.resolve()
      .then(() =>
        queryInterface.bulkInsert('roles', [
          {id: 'public'},
          {id: 'admin'}
        ])
      )
      .then(() =>
        hashifier.hash('password').then(({hash, salt}) =>
          queryInterface.bulkInsert('users', [
            {id: adminId, userName: 'admin', hash, salt},
            {id: tylerId, userName: 'tyler', hash, salt}
          ])
        )
      )
      .then(() =>
        queryInterface.bulkInsert('userRoles', [
          {userId: adminId, roleId: 'admin'},
          {userId: adminId, roleId: 'public'},
          {userId: tylerId, roleId: 'admin'},
          {userId: tylerId, roleId: 'public'}
        ])
      )
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Roles', null, {})
  }
}
