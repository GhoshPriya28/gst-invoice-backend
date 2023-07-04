'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Verification.init({
    users_id: DataTypes.STRING,
    verification_code: DataTypes.STRING,
    is_verified: DataTypes.STRING
  },
  {
    timestamps: false,
    sequelize,
    modelName: 'Verification',
    freezeTableName: true,
    tableName: 'user_verification'
  })
  return Verification;
};