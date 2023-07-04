'use strict';

//const sequelizeSoftDelete = require('sequelize-soft-delete')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class taxes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  taxes.init({
    
    label	:DataTypes.STRING,
    percentage: DataTypes.FLOAT,
    status: DataTypes.INTEGER
  },
  {
    timestamps: false,
    sequelize,
    modelName: 'taxe',
    freezeTableName: true,
    tableName: 'taxes'
  });
  return taxes ;
};