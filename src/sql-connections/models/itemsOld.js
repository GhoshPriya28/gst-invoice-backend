'use strict';

const sequelizeSoftDelete = require('sequelize-soft-delete')
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  items.init({
    product_id:DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_unit: DataTypes.STRING,
    selling_price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    status:DataTypes.TINYINT,
    is_deleted:DataTypes.TINYINT,
   
  },
  {
    timestamps: false,
    sequelize,
    modelName: 'items',
  });
  const options = { field: 'is_deleted', is_deleted: 1 }
  sequelizeSoftDelete.softDelete(items, options)
  return items;
};