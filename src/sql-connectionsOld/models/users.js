'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  // Users.init({
  //   first_name: DataTypes.STRING,
  //   last_name: DataTypes.STRING,
  //   email: DataTypes.STRING,
  //   password: DataTypes.STRING,
  //   resetPasswordExpires: DataTypes.DATE,
  //   token: DataTypes.STRING

  // },
  //modified by sahil
  Users.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    password: DataTypes.STRING,
    ref_password: DataTypes.STRING,
    aadhar_number: DataTypes.STRING,
    pan_card: DataTypes.STRING,
    gst_in: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
    token: DataTypes.STRING,
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'users',
    });
  return Users;
};