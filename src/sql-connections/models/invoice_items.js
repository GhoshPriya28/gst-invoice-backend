'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class InvoiceItems extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    InvoiceItems.init({
        inv_id: DataTypes.STRING,
        product_id: {
            type: DataTypes.STRING,
            references: { // <--- is this redundant to associate
                model: 'items',
                key: 'id'
            }
        },
        subtotal_price: DataTypes.FLOAT,
        selling_price: DataTypes.FLOAT,
        quantity: DataTypes.INTEGER,
        gst_percentage: DataTypes.INTEGER,
        taxable_price:DataTypes.FLOAT,
        is_deleted:DataTypes.TINYINT,
        description : DataTypes.TEXT,
        inv_uni_id: DataTypes.STRING
    },
        {
            timestamps: false,
            sequelize,
            modelName: 'invoice_items',
        });
    return InvoiceItems;
};