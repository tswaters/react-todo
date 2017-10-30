
import uuid from 'uuid'
import * as LoginToken from './token'
import * as hashifier from 'hashifier'

import Unauthorized from 'server/errors/unauthorized'
import BadRequest from 'server/errors/badRequest'
import NotFound from 'server/errors/notFound'

import Sequelize from 'sequelize'
import Todo from './todo'
import Role from './role'

export default class User extends Sequelize.Model {

  static init (sequelize, DataTypes) {
    super.init({
      userName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      hash: {
        allowNull: false,
        type: DataTypes.STRING
      },
      salt: {
        allowNull: false,
        type: DataTypes.STRING
      }
    }, {
      tableName: 'users',
      sequelize,
      timestamps: false
    })
  }

  static associate () {
    super.hasMany(Todo, {
      foreignKey: 'userId',
      as: 'user'
    })
    super.belongsToMany(Role, {
      through: 'userRoles',
      foreignKey: 'userId',
      otherKey: 'roleId',
      timestamps: false
    })
  }

  compare (password) {
    return hashifier.compare(password, this.hash, this.salt)
  }

  async changePassword (oldPassword, newPassword) {
    if (!await this.compare(oldPassword)) {
      throw new Unauthorized('incorrect password')
    }

    const {hash, salt} = await hashifier.hash(newPassword)
    this.hash = hash
    this.salt = salt

    await this.save()
  }

  static async logout (token = null) {
    await LoginToken.destroy(token)
  }

  static async authorize (token = null) {
    const loginToken = await LoginToken.fetch(token)
    if (!loginToken) { throw new Unauthorized('login token not found') }

    const user = await User.findById(loginToken.userId, {
      attributes: ['id', 'userName'],
      include: [{
        model: Role,
        attributes: ['id'],
        through: {
          attributes: []
        }
      }]
    })

    if (!user) { throw new Unauthorized('user not found') }
    return {...user.toJSON(), token}
  }

  static async login ({userName = null, password = null} = {}) {
    if (userName == null || typeof userName !== 'string' || userName.trim() === '') {
      throw new BadRequest('userName must be provided')
    }
    if (password == null || typeof password !== 'string' || password.trim() === '') {
      throw new BadRequest('password must be provided')
    }

    const user = await User.findOne({where: {userName}})
    if (!user || !user.compare(password)) { throw new Unauthorized('user not found') }

    const {id: token} = await LoginToken.upsert(null, user.id)
    return {...user.toJSON(), token}
  }

  static async changePassword ({id}, {oldPassword, newPassword}) {
    if (oldPassword == null || typeof oldPassword !== 'string' || oldPassword.trim() === '') {
      throw new BadRequest('old password must be provided')
    }
    if (newPassword == null || typeof newPassword !== 'string' || newPassword.trim() === '') {
      throw new BadRequest('new password must be provided')
    }

    const user = await User.findById(id, {attributes: ['id', 'hash', 'salt']})
    if (!user) { throw new NotFound() }

    await user.changePassword(oldPassword, newPassword)
    return user.toJSON()
  }

  static async register ({userName = null, password = null} = {}) {
    if (userName == null || typeof userName !== 'string' || userName.trim() === '') {
      throw new BadRequest('userName must be provided')
    }
    if (password == null || typeof password !== 'string' || password.trim() === '') {
      throw new BadRequest('password must be provided')
    }

    const existingUser = await User.findOne({where: {userName}})
    if (existingUser) { throw new BadRequest('userName already in use!') }

    const {hash, salt} = await hashifier.hash(password)

    const user = await User.create({
      id: uuid.v4(),
      userName,
      hash,
      salt
    })

    await user.addRole('public')

    const {id: token} = await LoginToken.upsert(null, user.id)
    return token
  }
}
