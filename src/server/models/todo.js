
import BadRequest from 'server/errors/badRequest'
import NotFound from 'server/errors/notFound'

import UserModel from './user'
import Sequelize from 'sequelize'

class TodoModel extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    super.init({
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    }, {
      tableName: 'todos',
      timestamps: false,
      scopes: {
        byUser (userId) {
          return {
            where: {userId},
            attributes: ['id', 'text']
          }
        }
      },
      sequelize
    })
  }
  static associate () {
    super.belongsTo(UserModel, {
      foreignKey: 'userId',
      as: 'user'
    })
  }

  static async list ({userId}) {
    const list = await TodoModel.scope({method: ['byUser', userId]}).findAll()
    return list.map(item => item.toJSON())
  }

  static async update ({id, userId, text}) {
    if (text == null || typeof text !== 'string' || text.trim() === '') {
      throw new BadRequest('text must be provided')
    }

    const model = await TodoModel.scope({method: ['byUser', userId]}).findById(id)
    if (!model) { throw new NotFound() }

    model.text = text
    await model.save()
    return model.toJSON()
  }

  static async remove ({id, userId}) {
    const model = await TodoModel.scope({method: ['byUser', userId]}).findById(id)
    if (!model) { throw new NotFound() }

    await model.destroy()
    return true
  }

  static async fetch ({id, userId}) {
    const todo = await TodoModel.scope({method: ['byUser', userId]}).findById(id)

    if (!todo) { throw new NotFound() }
    return todo.toJSON()
  }

}

export default TodoModel
