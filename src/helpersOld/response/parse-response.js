const queryHelper = require("../query/queryHelper.js");
require('dotenv').config();

//item
const getProductsResponseData = function (responseData, productId = null) {
	const responseItemsData = {
		productId: (responseData.id) ? responseData.id : 0,
		productUniqueId: (responseData.product_id) ? responseData.product_id : '',
		productName: (responseData.product_name) ? responseData.product_name : '',
		productUnit: (responseData.product_unit) ? responseData.product_unit : '',
		sellingPrice: (responseData.selling_price) ? responseData.selling_price : '',
		productDescription: (responseData.description) ? responseData.description : '',
		productType: (responseData.type == 1) ? 'Goods' : ((responseData.type == 2) ? 'Services' : ''),
	};

	return responseItemsData;
}

//customer
const getCutomersResponseData = async function(responseData, customerId = null){
    const responseCustomersData = {
        customerId : (responseData.id)?responseData.id:0,
        customerUniqueId : (responseData.customer_id)? responseData.customer_id:'',
        salutation : (responseData.salutation)? responseData.salutation:'',
        firstName : (responseData.first_name)?responseData.first_name:'',
        lastName : (responseData.last_name)?responseData.last_name:'',
        companyName : (responseData.company_name)?responseData.company_name:'',
        email : (responseData.email)?responseData.email:'',
        work_phone : (responseData.work_phone)?responseData.work_phone:'',
        mobile : (responseData.mobile)?responseData.mobile:'',
        pan : (responseData.pan)?responseData.pan:'',
        website : (responseData.website)?responseData.website:'',
        customerType : (responseData.types == 1)?'Business':((responseData.types == 2)?'Individual':''),
        createdAt : (responseData.createdAt)?responseData.createdAt:'',
        customerAddress : (responseData.customer_id)? await queryHelper.getAddressDetails(responseData.customer_id):'',
    };
    return responseCustomersData;
}
//address
const getAddressResponseData = function (responseData, addressId = null) {
	const responseCustomersData = {
		addressId: (responseData.id) ? responseData.id : 0,
		addressUniqueId: (responseData.address_id) ? responseData.address_id : '',
		attention: (responseData.attention) ? responseData.attention : '',
		address: (responseData.address) ? responseData.address : '',
		city: (responseData.city) ? responseData.city : '',
		state: (responseData.state) ? responseData.state : '',
		country: (responseData.country) ? responseData.country : '',
		zip_code: (responseData.zip_code) ? responseData.zip_code : '',
		address_phone: (responseData.address_phone) ? responseData.address_phone : '',
		addressType: (responseData.type == 1) ? 'Billing' : ((responseData.type == 2) ? 'Shipping' : (responseData.type == 3) ? 'Same' : ''),
	};

	return responseCustomersData;
}

//user response
// const getUsersResponseData = async function (responseData, token = null) {
// 	const responseUserData = {
// 		id: (responseData.id) ? responseData.id : 0,
// 		firstName: (responseData.first_name) ? responseData.first_name : '',
// 		lastName: (responseData.last_name) ? responseData.last_name : '',
// 		email: (responseData.email) ? responseData.email : '',
// 		loginToken: (token) ? token : '',
// 	};
// 	return responseUserData;
// }

//modified by sahil
//user response
const getUsersResponseData = async function (responseData, token = null) {
	const responseUserData = {
		id: (responseData.id) ? responseData.id : 0,
		firstName: (responseData.first_name) ? responseData.first_name : '',
		lastName: (responseData.last_name) ? responseData.last_name : '',
		email: (responseData.email) ? responseData.email : '',
		contactNumber: (responseData.contact_number) ? responseData.contact_number : '',
		aadharNumber: (responseData.aadhar_number) ? responseData.aadhar_number : '',
		panCard: (responseData.pan_card) ? responseData.pan_card : '',
		gstIn: (responseData.gst_in) ? responseData.gst_in : '',
		loginToken : (token)?token:'',
	};
	return responseUserData;
}

// invoice response with item details
const getInvoiceResponseData = async function (responseData, inv_id = null) {
	const itemData = await queryHelper.getitemDetailsByInvoiceId(responseData.inv_id)
	const responseInvoiceData = {
		inv_id: (responseData.inv_id) ? responseData.inv_id : 0,
		customer_id: (responseData.customer_id) ? responseData.customer_id : '',
		inv_date: (responseData.inv_date) ? responseData.inv_date : '',
		inv_terms: (responseData.inv_terms) ? responseData.inv_terms : '',
		inv_subject: (responseData.inv_subject) ? responseData.inv_subject : '',
		gst: (responseData.gst) ? responseData.gst : '',
		gst_type: (responseData.gst_type) ? responseData.gst_type : '',
		total_price: (responseData.total_price) ? responseData.total_price : '',
		status: (responseData.status) ? responseData.status : '',
		is_deleted: (responseData.is_deleted) ? responseData.is_deleted : '',
		due_date: (responseData.due_date) ? responseData.due_date : '',
		itemDetails: responseData.inv_id ? itemData : []
	};

	return responseInvoiceData;
}

//get all invoice response
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

module.exports = { 
getProductsResponseData, 
getUsersResponseData, 
getInvoiceResponseData, 
getAllInvoiceResponseData, 
getCutomersResponseData, 
getAddressResponseData 
};