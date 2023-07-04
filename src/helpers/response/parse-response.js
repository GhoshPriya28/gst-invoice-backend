const queryHelper = require("../query/queryHelper.js");
require('dotenv').config(); 
const moment = require('moment');
//customer
const getCutomersResponseData = async function(responseData, customerId = null){
	const responseCustomersData = {
		customerId : (responseData.id)?responseData.id:0,
		customerUniqueId : (responseData.customer_id)? responseData.customer_id:'',		
		salutation : (responseData.salutation)? responseData.salutation:'',
		firstName : (responseData.first_name)?responseData.first_name:'',
		lastName : (responseData.last_name)?responseData.last_name:'',
		displayName : (responseData.display_name)?responseData.display_name:'',
		companyName : (responseData.company_name)?responseData.company_name:'',
		email : (responseData.email)?responseData.email:'',
		work_phone : (responseData.work_phone)?responseData.work_phone:'',
		mobile : (responseData.mobile)?responseData.mobile:'',
		pan : (responseData.pan)?responseData.pan:'',
		gstin : (responseData.gstin)?responseData.gstin:'',
		customerType : (responseData.types)?responseData.types:'',
		createdAt : (responseData.createdAt)?responseData.createdAt:'',
		payment_terms: (responseData.payment_terms)?responseData.payment_terms:'',
		customerAddress : (responseData.customer_id)? await queryHelper.getAddressDetails(responseData.customer_id):'',
		is_deleted: (responseData.is_deleted) ? responseData.is_deleted: 0,
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
const getUsersResponseData = async function (responseData, token = null) {
	const responseUserData = {
		user_id:(responseData.user_id) ? responseData.user_id : '',
		id: (responseData.id) ? responseData.id : 0,
		first_ame: (responseData.first_name) ? responseData.first_name : '',
		last_name: (responseData.last_name) ? responseData.last_name : '',
		email: (responseData.email) ? responseData.email : '',
		contact_number: (responseData.contact_number) ? responseData.contact_number : '',
		aadhar_number: (responseData.aadhar_number) ? responseData.aadhar_number : '',
		pan_card: (responseData.pan_card) ? responseData.pan_card : '',
		gst_in: (responseData.gst_in) ? responseData.gst_in : '',
		address: (responseData.address) ? responseData.address : '',
		trade_name: (responseData.trade_name) ? responseData.trade_name : '',
		profile_pic: (responseData.profile_pic)?process.env.BASE_URL+'uploads/'+responseData.profile_pic:process.env.BASE_URL+'assets/images/default_logo_avatar.png',
		loginToken : (token)?token:'',
		paymentQrCode: (responseData.payment_qr_code)?process.env.BASE_URL+'uploads/'+responseData.payment_qr_code:'',
		website:(responseData.website) ? responseData.website : '',
		terms:(responseData.terms) ? responseData.terms : '',
	};
    return responseUserData;
}

const getProductsResponseData = function(responseData, productId = null){
	const responseItemsData = {
		productId : (responseData.id)?responseData.id:0,
		productUniqueId : (responseData.product_id)?responseData.product_id:'',
		userId : (responseData.user_id)? responseData.user_id:'',
		productName : (responseData.product_name)?responseData.product_name:'',
		productUnit : (responseData.product_unit)?responseData.product_unit:'',
		sellingPrice : (responseData.selling_price)?responseData.selling_price:'',
		productDescription : (responseData.description)?responseData.description:'',
		hsn : (responseData.hsn)?responseData.hsn:'',
		sac : (responseData.sac)?responseData.sac:'',
		item_code : (responseData.item_code)?responseData.item_code:'',
		productType : (responseData.type == 1)?'Goods':((responseData.type == 2)?'Services':''),
		is_deleted: (responseData.is_deleted) ? responseData.is_deleted: 0,
	};

    return responseItemsData;
}

// invoice response with item details
const getInvoiceResponseData = async function (responseData, inv_id = null) {
	const itemData = await queryHelper.getitemDetailsByInvoiceId(responseData.inv_uni_id)
	const responseInvoiceData = {
		userId:(responseData.user_id) ? responseData.user_id : '',
		inv_id: (responseData.inv_id) ? responseData.inv_id : 0,
		inv_uni_id: (responseData.inv_uni_id) ? responseData.inv_uni_id : 0,
		display_inv: (responseData.display_inv) ? responseData.display_inv : '',
		customer_id: (responseData.customer_id) ? responseData.customer_id : '',
		purchase_order: (responseData.purchase_order) ? moment(responseData.purchase_order).format(moment.HTML5_FMT.DATE) : '',
		order_number: (responseData.order_number) ? responseData.order_number : '',
		inv_date: (responseData.inv_date) ? responseData.inv_date : '',
		inv_terms: (responseData.inv_terms) ? responseData.inv_terms : '',
		inv_subject: (responseData.inv_subject) ? responseData.inv_subject : '',  
		gst: (responseData.gst) ? responseData.gst : '',
		gst_type: (responseData.gst_type) ? responseData.gst_type : '',
		total_price: (responseData.inv_uni_id) ? await queryHelper.getSumofSellingPriceByInvoiceId(responseData.inv_uni_id) : '',
		status: (responseData.status) ? responseData.status : '',
		is_deleted: (responseData.is_deleted) ? responseData.is_deleted : 0,
		due_date: (responseData.due_date) ? responseData.due_date : '',
		itemDetails: responseData.inv_uni_id ? itemData : [],
		paymentQrCode: (responseData.payment_qr_code)?process.env.BASE_URL+'uploads/'+responseData.payment_qr_code:process.env.BASE_URL+'assets/images/default_logo_avatar.png',
		eInvQrCode: (responseData.e_inv_qr_code)?process.env.BASE_URL+'uploads/'+responseData.e_inv_qr_code:process.env.BASE_URL+'assets/images/default_logo_avatar.png',
		invLogo: (responseData.inv_logo)?process.env.BASE_URL+'uploads/'+responseData.inv_logo:process.env.BASE_URL+'assets/images/default_logo_avatar.png',
	};

	return responseInvoiceData;
}

//get all invoice response
const getAllInvoiceResponseData = async function (responseData, inv_id = null) {
	const responseAllInvoiceData = {
		userId:(responseData.user_id) ? responseData.user_id : '',
		inv_id: (responseData.inv_id) ? responseData.inv_id : 0,
		inv_uni_id: (responseData.inv_uni_id) ? responseData.inv_uni_id : 0,
		display_inv: (responseData.display_inv) ? responseData.display_inv : '',
		customer_ame: responseData.customer_id ? await queryHelper.getCustomerDisplayNameById(responseData.customer_id) : '',
		status: (responseData.status) ? responseData.status : 0,
		date: (responseData.inv_date) ? responseData.inv_date : '',
		due_date: (responseData.due_date) ? responseData.due_date : '',
		amount: responseData.inv_uni_id ? await queryHelper.getSumofSellingPriceByInvoiceId(responseData.inv_uni_id) : '',
	};
	return responseAllInvoiceData;
}

// get all UPI response
const getAllUpiResponseData = async function (responseData, id = null) {
	const responseAllUpiData = {
		id: (responseData.id) ? responseData.id : 0,
	    user_id:(responseData.user_id) ? responseData.user_id : '',
		upi_id: (responseData.upi_id) ? responseData.upi_id : '',
		upi_number: (responseData.upi_number) ? responseData.upi_number : '',
		upi_type: (responseData.upi_type) ? responseData.upi_type : '',
		status: (responseData.status) ? responseData.status : 0,
	};

	return responseAllUpiData;
}


module.exports =  { 
	getCutomersResponseData, 
	getAddressResponseData,
	getProductsResponseData, 
	getUsersResponseData, 
	getInvoiceResponseData, 
	getAllInvoiceResponseData,
	getAllUpiResponseData,
	
};