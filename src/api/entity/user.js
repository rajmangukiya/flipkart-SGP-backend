import pkg from 'sequelize';
import { development } from '../../database/config.js';
const { DataTypes, Sequelize } = pkg;

const User = development.define('user', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  api_key: {
    type: DataTypes.STRING,
    allowNull: false
  },
},
  {
    timestamps: true,
  })

export {
  User
}