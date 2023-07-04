'use strict';

//const sequelizeSoftDelete = require('sequelize-soft-delete')
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  address.init({
    address_id:DataTypes.STRING,
    customer_id:DataTypes.STRING,
    attention: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    zip_code: DataTypes.INTEGER,
    address_phone:DataTypes.STRING,
    type: DataTypes.TINYINT, 
    is_deleted:DataTypes.TINYINT,
  },
  {
    timestamps: false,
    sequelize,
    modelName: 'address',
    freezeTableName: true,
    tableName: 'address'
  });
  return address ;
};