'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class password extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  password.init({
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expireDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'password',
  });
  return password;
};