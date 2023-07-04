const { sequelize } = require("../../sql-connections/models");

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
//get details from invoice item table
exports.getitemDetailsByInvoiceId = async (inv_id) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT a.product_id, a.quantity, a.selling_price, a.gst_percentage, a.taxable_price, a.subtotal_price,  b.product_unit, b.product_name, b.description FROM invoice_items as a inner join items as b on b.product_id = a.product_id where inv_id= '" + inv_id + "' AND a.quantity > 0", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			resolve(queryData)
		}).catch(error => {
			console.log('Invoice Id Error', error)
			reject(error)
		})
	})
}

//get address details
exports.getAddressDetails = async (customer_id) => {
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

//get selling price from invoice items table
exports.getSumofSellingPriceByInvoiceId = async (inv_id) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT SUM(subtotal_price) as totalSum FROM `invoice_items` WHERE inv_id =  '" + inv_id + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			resolve(queryData[0].totalSum)
		}).catch(error => {
			console.log('Invoice Id Error', error)
			reject(error)
		})
	})
}

//get taxable price from invoice items table
exports.getSumofTaxablePriceByInvoiceId = async (inv_id) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT SUM(taxable_price) as totalSum FROM `invoice_items` WHERE inv_id =  '" + inv_id + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			resolve(queryData[0].totalSum)
		}).catch(error => {
			console.log('Invoice Id Error', error)
			reject(error)
		})
	})
}

// select last id for add invoice
exports.getLastId = async()=>{
	return new Promise((resolve, reject) => {
		sequelize.query(" SELECT MAX( id ) FROM invoices;",{ type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Query Data', queryData[0]['MAX( id )'])
			resolve(queryData[0]['MAX( id )'])
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}	

// invoice date
exports.date = async (callback=()=>{}) => {
	const currentYear = new Date().getFullYear()
	const nextYear = currentYear + 1
	let str = nextYear.toString();
	const year = str.substring(2)
	const lastId = await this.getLastId()
	console.log("lastId",lastId);
	callback(currentYear + "-" + year, lastId+1)
}

//get customernamebyid
exports.getCustomerDisplayNameById = async (customer_id) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT display_name, customer_id FROM customers WHERE customer_id = '" + customer_id + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			if (queryData.length > 0) {
				let display_name = queryData[0].display_name;
				resolve(display_name)
			}
			else {
				resolve(display_name = '')
			}
		}).catch(error => {
			console.log('Customer Id Error', error)
			reject(error)
		})
	})
}
//get User Details By User Id
exports.getUserDetailsByUserId = async (invoiceId) => {
	var userDetails = {}
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT * FROM users WHERE user_id = (SELECT user_id FROM invoices WHERE inv_id = '" + invoiceId + "')", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			if (queryData.length > 0) {
				userDetails = queryData[0]
				resolve(userDetails)
			}
			else {
				resolve(userDetails)
			}
		}).catch(error => {
			console.log('User Details Error', error)
			reject(error)
		})
	})
}
//get Customer Details By Invoice Id
exports.getCustomerDetailsByInvoiceId = async (invoiceId) => {
	var customerDetails = {}
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT * FROM customers WHERE customer_id = (SELECT customer_id FROM invoices WHERE inv_id = '" + invoiceId + "')", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			if (queryData.length > 0) {
				customerDetails = queryData[0]
				resolve(customerDetails)
			}
			else {
				resolve(customerDetails)
			}
		}).catch(error => {
			console.log('Customer Details Error', error)
			reject(error)
		})
	})
}

//get address Details By Invoice Id
exports.getAddressDetailsByInvoiceId = async (invoiceId) => {
	var addressDetail = {}
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT * FROM address WHERE customer_id = (SELECT customer_id FROM invoices WHERE inv_id = '" + invoiceId + "')", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			if (queryData.length > 0) {
				addressDetail = queryData[0]
				resolve(addressDetail)
			}
			else {
				resolve(addressDetail)
			}
		}).catch(error => {
			console.log('Address Details Error', error)
			reject(error)
		})
	})
}

//get terms By Invoice Id
exports.getTermsByInvoiceId = async (userId) => {
	var termsDetails = {}
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT * FROM terms WHERE user_id = '" + userId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			// console.log("queryData",queryData);
			if (queryData.length > 0) {
				termsDetails = queryData[0]
				resolve(termsDetails)
			}
			else {
				resolve(termsDetails)
			}
		}).catch(error => {
			console.log('Terms Details Error', error)
			reject(error)
		})
	})
}

//get neft details by userid
exports.getNeftDetailsByUserId = async (userId) => {
	return new Promise((resolve, reject) => {
		var neftDetails = {}
		sequelize.query("SELECT * FROM user_accounts WHERE user_id = '" + userId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log("queryDataneft",queryData);
			if (queryData.length > 0) {
				neftDetails = queryData[0].bank_name + ' , ' + queryData[0].account_number + ' , ' + queryData[0].ifsc_code + ' , ' + queryData[0].account_holder + ' , ' + queryData[0].address;
				// neftDetails = queryData[0]
				console.log("neftDetails",neftDetails);
				resolve(neftDetails)
			}
			else {
				resolve(neftDetails = '')
			}
		}).catch(error => {
			console.log('Customer Id Error', error)
			reject(error)
		})
	})
}

exports.getProductNameById = async (productId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT product_name FROM items where product_id = '" + productId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			if (queryData.length > 0) {
				let product_name = queryData[0].product_name;
				resolve(product_name)
			}
			else {
				resolve(product_name = '')
			}
		}).catch(error => {
			console.log('Product Name Error', error)
			reject(error)
		})
	})
}

exports.getProductDescriptionById = async (productId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT description FROM items where product_id = '" + productId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			if (queryData.length > 0) {
				let description = queryData[0].description;
				resolve(description)
			}
			else {
				resolve(description = '')
			}
		}).catch(error => {
			console.log('Product Description Error', error)
			reject(error)
		})
	})
}