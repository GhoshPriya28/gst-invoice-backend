'use strict';
const { Model } = require('sequelize');
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
        key: 'customer_id'
      }
    },
    display_inv: DataTypes.STRING,
    inv_logo: DataTypes.STRING,
    e_inv_qr_code: DataTypes.STRING,
    
    footer: DataTypes.TEXT,
    user_id: DataTypes.STRING,
    terms_id: DataTypes.STRING,
    purchase_order:DataTypes.DATE,
    order_number: DataTypes.STRING,
    inv_date: DataTypes.DATE,
    inv_terms: DataTypes.STRING,
    due_date: DataTypes.DATE,
    inv_subject: DataTypes.TEXT,
    gst_type: DataTypes.STRING,
    gst: DataTypes.INTEGER,
    total_price: DataTypes.FLOAT,
    status: DataTypes.TINYINT,
    is_deleted: DataTypes.TINYINT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    inv_uni_id: DataTypes.STRING
  }, {
    timestamps: false,
    sequelize,
    modelName: 'invoice',
    freezeTableName: true,
    tableName: 'invoices'
  });
  // const options = { field: 'is_deleted', is_deleted: 1 }
  // sequelizeSoftDelete.softDelete(Invoice, options)
  return Invoice;
};