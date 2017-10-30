
import Sequelize, {DataTypes} from 'sequelize'
import config from 'server/config/config'

import UserModel from './user'
import TodoModel from './todo'
import RoleModel from './role'

const {NODE_ENV: env = 'development'} = process.env
const envConfig = config[env]

const sequelizeConfig = envConfig.use_env_variable
  ? [process.env[envConfig.use_env_variable]]
  : [envConfig.database, envConfig.username, envConfig.password, envConfig]

const sequelize = new Sequelize(...sequelizeConfig)

UserModel.init(sequelize, DataTypes)
TodoModel.init(sequelize, DataTypes)
RoleModel.init(sequelize, DataTypes)

UserModel.associate(sequelize)
TodoModel.associate(sequelize)
RoleModel.associate(sequelize)

export default new Sequelize(...sequelizeConfig)

// const db = {sequelize}
// const things = {role, user, todo}

// Object.keys(things)
//   .map(name => db[name] = things[name](sequelize, DataTypes))
//   .forEach(thing => thing.associate && thing.associate(db))

// export default db
