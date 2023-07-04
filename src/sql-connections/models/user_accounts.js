'use strict';

//const sequelizeSoftDelete = require('sequelize-soft-delete')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user_accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_accounts.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    user_id:DataTypes.STRING,
    bank_name:DataTypes.STRING,
    ifsc_code: DataTypes.STRING,
    account_number: DataTypes.STRING,
    account_holder: DataTypes.STRING,
    account_email: DataTypes.STRING,
    address: DataTypes.STRING,
    status:DataTypes.TINYINT,
  },
  {
    timestamps: false,
    sequelize,
    modelName: 'user_accounts',
    freezeTableName: true,
    tableName: 'user_accounts'
  });
  return user_accounts ;
};