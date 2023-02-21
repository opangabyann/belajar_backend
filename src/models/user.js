'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasOne(models.identitas, {
        as : "identitas",
        foreignKey : "userId"
      })

      user.hasMany(models.nilai, {
        as : "nilai",
        foreignKey : "userId"
      })

    }
  }
  user.init({
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    password : DataTypes.STRING,
    isEmailVerified : DataTypes.DATE,
    isActive: DataTypes.BOOLEAN,
    tempatLahir: DataTypes.STRING,
    tanggalLahir: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};