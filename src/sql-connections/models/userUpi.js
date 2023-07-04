'use strict';

const sequelizeSoftDelete = require('sequelize-soft-delete')
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class upi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  upi.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id:DataTypes.STRING,
    upi_id: DataTypes.STRING,
    upi_number: DataTypes.STRING,
    upi_type: DataTypes.STRING,
    status:DataTypes.TINYINT,
  },
  {
    timestamps: false,
    sequelize,
    modelName: 'upiLists',
    freezeTableName: true,
    tableName: 'user_upi'
  });
  return upi;
};