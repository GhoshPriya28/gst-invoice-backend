const queryHelper = require("../query/queryHelper.js");
require('dotenv').config(); 

const getUsersResponseData = async function(responseData,token = null,userId = null)
{
	const responseUserData = {
		id : (responseData.id)?responseData.id:0,
		userId : (responseData.user_id)?responseData.user_id:'',
		firstName : (responseData.first_name)?responseData.first_name:'',
		lastName : (responseData.last_name)?responseData.last_name:'',
		email : (responseData.email)?responseData.email:'',
		loginToken : (token)?token:'',
	};
    return responseUserData;
}

const getProductsResponseData = function(responseData, productId = null){
	const responseItemsData = {
		productId : (responseData.id)?responseData.id:0,
		productUniqueId : (responseData.product_id)?responseData.product_id:'',
		productName : (responseData.product_name)?responseData.product_name:'',
		productUnit : (responseData.product_unit)?responseData.product_unit:'',
		sellingPrice : (responseData.selling_price)?responseData.selling_price:'',
		productDescription : (responseData.description)?responseData.description:'',
		productType : (responseData.type == 1)?'Goods':((responseData.type == 2)?'Services':''),
	};

    return responseItemsData;
}

// invoice response
const getInvoiceResponseData = function (responseData, inv_id = null) {
	const responseInvoiceData = {
		inv_id: (responseData.inv_id) ? responseData.inv_id : 0,
		customer_id: (responseData.customer_id) ? responseData.customer_id : '',
		// status: (responseData.status) ? responseData.status : '',
		due_date: (responseData.due_date) ? responseData.due_date : '',
	};

	return responseInvoiceData;
}

const getAllInvoiceResponseData = async function (responseData, inv_id = null) {
	const responseAllInvoiceData = {
		inv_id: (responseData.inv_id) ? responseData.inv_id : 0,
		customer_name: responseData.customer_id ? await queryHelper.getCustomerNameById(responseData.customer_id) : '',
		status: (responseData.status) ? responseData.status : 0,
		Data: (responseData.created_at) ? responseData.created_at : '',
		due_date: (responseData.due_date) ? responseData.due_date : '',
		Amount: (responseData.total_price) ? responseData.total_price : ''
	};

	return responseAllInvoiceData;
}

const getCutomersResponseData = function(responseData, customerId = null){
	const responseCustomersData = {
		customerId : (responseData.id)?responseData.id:0,
		customerUniqueId : (responseData.customer_id)?responseData.customer_id:'',
		salutation : (responseData.salutation)?responseData.salutation:'',
		firstName : (responseData.first_name)?responseData.first_name:'',
		lastName : (responseData.last_name)?responseData.last_name:'',
		email : (responseData.email)?responseData.email:'',
		work_phone : (responseData.work_phone)?responseData.work_phone:'',
		mobile : (responseData.mobile)?responseData.mobile:'',
		pan : (responseData.pan)?responseData.pan:'',
		website : (responseData.website)?responseData.website:'',
		customerType : (responseData.types == 1)?'Business':((responseData.types == 2)?'Individual':''),
	};

    return responseCustomersData;
}

const getAddressResponseData = function(responseData, addressId = null){
	const responseCustomersData = {
		addressId : (responseData.id)?responseData.id:0,
		addressUniqueId : (responseData.address_id)?responseData.address_id:'',
		attention : (responseData.attention)?responseData.attention:'',
		address : (responseData.address)?responseData.address:'',
		city : (responseData.city)?responseData.city:'',
		state : (responseData.state)?responseData.state:'',
		country : (responseData.country)?responseData.country:'',
		zip_code : (responseData.zip_code)?responseData.zip_code:'',
		address_phone : (responseData.address_phone)?responseData.address_phone:'',
		addressType : (responseData.type == 1)?'Billing':((responseData.type == 2)?'Shipping':(responseData.type == 3)?'Same':''),
	};

    return responseCustomersData;
}

module.exports =  { getCutomersResponseData, getAddressResponseData,getProductsResponseData, getUsersResponseData, getInvoiceResponseData, getAllInvoiceResponseData };
