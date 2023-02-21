'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nilai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      nilai.belongsTo(models.user,{
        as : "user",
        foreignKey : "userId",
        
      })
    }
  }
  nilai.init({
    userId: DataTypes.INTEGER,
    mapel: DataTypes.STRING,
    nilai: DataTypes.DECIMAL(4,2)
  }, {
    sequelize,
    modelName: 'nilai',
  });
  return nilai;
};