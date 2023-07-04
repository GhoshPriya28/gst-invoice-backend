'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reports.init({
    users_id: DataTypes.INTEGER,
    participants_id: DataTypes.INTEGER,
    report_type: DataTypes.STRING,
    notes: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
    {
      timestamps: false,
      sequelize,
      tableName: 'reports',
    });
  return Reports;
};
