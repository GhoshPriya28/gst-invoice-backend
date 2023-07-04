'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailTemplate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmailTemplate.init({
    content: { type: DataTypes.TEXT },
    status: { type: DataTypes.TINYINT }
  }, {
    timestamps: false,
    sequelize,
    modelName: 'emailTemplate',
    freezeTableName: true,
    tableName: 'email_tamplates'
  });
  return EmailTemplate;
};
