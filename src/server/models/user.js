
import uuid from 'uuid'
import Sequelize from 'sequelize'
import * as LoginToken from 'server/models/token'
import * as hashifier from 'hashifier'
import {Unauthorized, BadRequest, NotFound} from 'server/errors'
import Todo from 'server/models/todo'
import Role from 'server/models/role'

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

  static async logout (token = null) {
    await LoginToken.destroy(token)
  }

  static async authorize (token = null) {
    const loginToken = await LoginToken.fetch(token)
    if (!loginToken) { throw new Unauthorized('login token not found') }

    const user = await User.findByPk(loginToken.userId, {
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
    if (!user || !hashifier.compare(password, user.hash, user.salt)) { throw new Unauthorized('user not found') }

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

    const user = await User.findByPk(id, {attributes: ['id', 'hash', 'salt']})
    if (!user) { throw new NotFound() }

    if (!await hashifier.compare(oldPassword, user.hash, user.salt)) {
      throw new Unauthorized('incorrect password')
    }

    const {hash, salt} = await hashifier.hash(newPassword)
    user.hash = hash
    user.salt = salt
    await user.save()

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
