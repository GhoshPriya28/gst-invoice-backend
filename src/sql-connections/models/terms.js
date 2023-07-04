'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Terms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Terms.init({
    terms_label: DataTypes.TEXT,
    terms_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
  },
 
  {
    timestamps: false,
    sequelize,
    modelName: 'terms',
    freezeTableName: true,
    tableName: 'terms'
  });
  return Terms;
};