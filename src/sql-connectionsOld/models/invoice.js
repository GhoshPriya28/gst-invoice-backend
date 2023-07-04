'use strict';
const { Model } = require('sequelize');
const sequelizeSoftDelete = require('sequelize-soft-delete')
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // define association here
    }
  }
  Invoice.init({
    inv_id: DataTypes.STRING,
    customer_id: {
      type: DataTypes.STRING,
      references: { // <--- is this redundant to associate
        model: 'customers',
        key: 'id'
      }
    },
    order_num: DataTypes.STRING,
    inv_date: DataTypes.DATE,
    inv_terms: DataTypes.STRING,
    due_date: DataTypes.DATE,
    inv_subject: DataTypes.TEXT,
    gst_type: DataTypes.ENUM('cgst', 'sgst', 'igst', 'utgst'),
    gst: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    status: DataTypes.TINYINT,
    is_deleted: DataTypes.TINYINT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    timestamps: false,
    sequelize,
    modelName: 'invoice',
    freezeTableName: true,
    tableName: 'invoices'
  });
  const options = { field: 'is_deleted', is_deleted: 1 }
  sequelizeSoftDelete.softDelete(Invoice, options)

  return Invoice;
};
