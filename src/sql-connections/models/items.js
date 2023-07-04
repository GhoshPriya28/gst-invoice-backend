'use strict';

const { Model } = require('sequelize');

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
    user_id:DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_unit: DataTypes.STRING,
    selling_price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    status:DataTypes.TINYINT,
    is_deleted:DataTypes.TINYINT,
    hsn: DataTypes.STRING,
    sac: DataTypes.STRING,
    item_code : DataTypes.STRING,
   
  },
  {
    timestamps: false,
    sequelize,
    modelName: 'items',
  });
  return items;
};