
import Sequelize from 'sequelize'
import UserModel from './user'

class RoleModel extends Sequelize.Model {

  static init (sequelize, DataTypes) {
    super.init({
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
      }
    }, {
      modelName: 'roles',
      timestamps: false,
      sequelize
    })
  }

  static associate () {
    super.belongsToMany(UserModel, {
      through: 'userRoles',
      as: 'users',
      foreignKey: 'roleId',
      otherKey: 'userId',
      timestamps: false
    })
  }
}

export default RoleModel
