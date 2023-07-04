const { sequelize } = require("../../sql-connections/models");
const { getUsersResponseData } = require("../response/parse-response.js");

//get data
exports.getDataFromQuery = async (queryString) => {
	return new Promise((resolve, reject) => {
		sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Query Data', queryData)
			resolve(queryData)
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}
// update data
exports.modifyDataFromQuery = async (queryString, modiifedData) => {
	return new Promise((resolve, reject) => {
		sequelize.query(queryString, { type: sequelize.QueryTypes.UPDATE }).then(queryData => {
			console.log('Query Data', queryData)
			resolve(queryData)
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}
// create data
exports.insertDataFromQuery = async (queryString, insertData) => {
	return new Promise((resolve, reject) => {
		sequelize.query(queryString, { type: sequelize.QueryTypes.INSERT }).then(queryData => {
			console.log('Query Data', queryData)
			resolve(queryData)
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}

//get customernamebyid
exports.getCustomerNameById = async (customer_id) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT first_name,last_name, customer_id FROM customers WHERE customer_id = '" + customer_id + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			if (queryData.length > 0) {
				let customer_name = queryData[0].first_name + ' ' + queryData[0].last_name;
				resolve(customer_name)
			}
			else {
				resolve(customer_name = '')
			}
		}).catch(error => {
			console.log('Customer Id Error', error)
			reject(error)
		})
	})
}
//get item details
exports.getitemDetailsByInvoiceId = async (inv_id) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT product_id,quantity, subtotal_price, selling_price FROM invoice_items WHERE inv_id = '" + inv_id + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			resolve(queryData)
		}).catch(error => {
			console.log('Invoice Id Error', error)
			reject(error)
		})
	})
}
//get address details
exports.getAddressDetails = async(customer_id)=>{
    return new Promise((resolve, reject) => {
        sequelize.query("SELECT * FROM address WHERE customer_id = '" + customer_id + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
            console.log('queryData', queryData);
            resolve(queryData)
        }).catch(error => {
            console.log('Customer Id Error', error)
            reject(error)
        })
    })
}