'use strict';

const sequelizeSoftDelete = require('sequelize-soft-delete')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customers.init({
    customer_id:DataTypes.STRING,
    salutation: DataTypes.ENUM('salutation'),
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    company_name: DataTypes.STRING,
    email: DataTypes.STRING,
    work_phone: DataTypes.STRING,
    mobile: DataTypes.STRING,
    pan:DataTypes.STRING,
    website: DataTypes.STRING,
    types: DataTypes.TINYINT,
    is_deleted:DataTypes.TINYINT,
   
  },
  {
    timestamps: true,
    sequelize,
    modelName: 'customers',
  });
//   const options = { field: 'is_deleted', is_deleted: 1 }
//   sequelizeSoftDelete.softDelete(customers, options)
  return customers;
};