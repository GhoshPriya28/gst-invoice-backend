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
        subtotal_price: DataTypes.INTEGER,
        selling_price: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER
    },
        {
            timestamps: false,
            sequelize,
            modelName: 'invoice_items',
        });
    return InvoiceItems;
};