const {Customers, Address} = require('../../sql-connections/models');
const { body,validationResult } = require("express-validator");
const {success,error,customResponse,validation} = require("../../helpers/response/api-response.js");
const {getCutomersResponseData, getAddressResponseData} = require('../../helpers/response/parse-response');
const { v4: uuidv4 } = require('uuid');

//add customer with address
exports.addCustomer = [
    body("first_name").isLength({ min: 1 }).trim().withMessage("First name must be specified."),
    body("last_name").isLength({ min: 1 }).trim().withMessage("Last name must be specified."),
    body("company_name").isLength({ min: 1 }).trim().withMessage("Company name must be specified."),
    body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
	.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
		return Customers.findOne({
			where:
            {
				email: value
			}
		}).then((user) =>{
			if (user) 
            {
				return Promise.reject("E-mail already in use");
			}
		});
	}),
    body("work_phone").isLength({ min: 1 }).trim().withMessage("Work phone must be specified."),
    body("mobile").isLength({ min: 1 }).trim().withMessage("Mobile number must be specified."),
    body("pan").isLength({ min: 1 }).trim().withMessage("Pan number must be specified."),
    body("website").isLength({ min: 1 }).trim().withMessage("website type must be specified."),
	body("types").isLength({ min: 1 }).trim().withMessage("Business type must be specified."),

    body("address").isLength({ min: 1 }).trim().withMessage("address must be specified."),
    body("city").isLength({ min: 1 }).trim().withMessage("City must be specified."),
    body("state").isLength({ min: 1 }).trim().withMessage("Satate must be specified."),
	body("country").isLength({ min: 1 }).trim().withMessage("Country must be specified."),
    body("zip_code").isLength({ min: 1 }).trim().withMessage("Zip code must be specified."),
    body("address_phone").isLength({ min: 1 }).trim().withMessage("Address phone must be specified."),
    body("type").isLength({ min: 1 }).trim().withMessage("Address type must be specified."),
    async (req, res) =>{
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
            {
                validation(res, errors.array()[0].msg, errors.array());
            }
            else
            {
                const customer = {
                    customer_id:uuidv4(),
                    salutation:req.body.salutation,
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    company_name:req.body.company_name,
                    email:req.body.email,
                    work_phone:req.body.work_phone,
                    mobile:req.body.mobile,
                    pan:req.body.pan,
                    website:req.body.website,
                    types:req.body.types
                }
                 await Customers.create(customer).then(async customerSaveDetails => {
                    const address ={
                        address_id:uuidv4(),
                        customer_id:customer.customer_id,
                        attention:req.body.attention,
                        address:req.body.address,
                        city:req.body.city,
                        state:req.body.state,
                        country:req.body.country,
                        zip_code:req.body.zip_code,
                        address_phone:req.body.address_phone,
                        type:req.body.type,
                    }
                    await Address.create(address).then(async addressSaveDetails => {
                        success(res, 200,"Customer added Successfuly.");
                    }).catch(err => {
                        error(res, 500, err);
                    })
                }).catch(err => {
                    error(res, 500, err);
                })
                
            }
        }catch(err){
            error(res, 500, err);
        }
    }
];

//update customer
exports.updateCustomer = [
    body("customerId").isLength({ min: 1 }).trim().withMessage("Customer id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                validation(res, errors.array()[0].msg, errors.array());
            }
            else
            {
                Customers.findOne({ where: { customer_id: req.body.customerId } }).then((data) =>{
                      if (data)
                      {
                        let updateData = { salutation:req.body.salutation, first_name:req.body.first_name, last_name:req.body.last_name, company_name:req.body.company_name, email:req.body.email, work_phone:req.body.work_phone,mobile:req.body.mobile, pan:req.body.pan,website:req.body.website,types:req.body.types }
                        Customers.update(updateData, { where: { customer_id: req.body.customerId }}).then(customerdata =>{
                            success(res, 200,"Cutomer updated Successfuly.", customerdata);
                        }).catch(err => {
                            error(res, 500, err);
                        });
                      }
                      else
                      {
                        error(res, 404, "Customer not exists with this id");
                      }
                }).catch(err => {
                    error(res, 500, err);
                });    
            }
        } catch(err){
            error(res, 500, err);
        }
    }
]

//Customer list
exports.getAllCustomers = async (req, res) => {
    try
    {  
        if (req.query.pageNum =='')
        {
            customResponse(res, 1, 'Please provide Page Number.');
        }
        else
        {
            let pagingLimit = 10;
            let numberOfRows, numberOfPages;
            let numberPerPage = parseInt(pagingLimit,10) || 1;
            let pageNum = parseInt(req.query.pageNum, 10) || 1;
            let pagingOffset = (pageNum - 1) * numberPerPage;
            var offset = pagingLimit * ((parseInt(req.query.pageNum,10) - 1));
        
            var finalCustomerList = []
            var finalDetails = {}

            Customers.findAndCountAll({offset: pagingOffset, limit: pagingLimit}).then(async customerList => {
                numberOfRows = customerList.count
                numberOfPages = Math.ceil(parseInt(numberOfRows,10) / numberPerPage);
                const pagination = {
                    current: pageNum,
                    numberPerPage: numberPerPage,
                    has_previous: pageNum > 1,
                    previous: pageNum - 1,
                    has_next: pageNum < numberOfPages,
                    next: pageNum + 1,
                    last_page: Math.ceil(parseInt(numberOfRows,10) / pagingLimit)
                }
                allCustomersList = customerList.rows
                for(let i=0; i< allCustomersList.length; i++)
                {
                    const finalCustomerDetails = await getCutomersResponseData(allCustomersList[i])
                    finalCustomerList.push(finalCustomerDetails)
                }
                finalDetails.pagination = pagination
                finalDetails.customerList = finalCustomerList
                success(res,200,'Customer List',finalDetails)
            }).catch(customerListError => {
                customResponse(res,1,customerListError)
            })
        }
    }
    catch(err)
    {
        customResponse(res, 1, err);
    }
}

//customer details
exports.GetByCustomerId = async (req, res) => {
    try {
        if (req.query.customerId =='')
        {
            customResponse(res, 1, 'Please provide customer id.');
        }
        else
        {
            const customerDetails = await Customers.findOne({ where: { customer_id: req.query.customerId } });
            if(customerDetails)
            {
                const finalCustomerDetails = await getCutomersResponseData(customerDetails)
                success(res,200,'Customer Details',finalCustomerDetails)
            }
            else
            {
                customResponse(res,1,'No Customer Found with this customer id in our system.');
            }
        }
       
    } catch (err) {
        customResponse(res,1,err.message);
    }
}

//delete customer
exports.deleteByCustomerId = [
    async (req, res)=>{ 
        try{
            if(req.query.customerId =='')
            {
               customResponse(res, 1, 'Please provide customer id.');
            }
            else
            {
                var id = {customer_id : req.query.customerId};
    
                Customers.findOne({ where:id }).then((data) =>{
                    if(data)
                    {
                        let updateCustomer = {is_deleted:1};
                        Customers.update(updateCustomer, { where: id }).then(customerData => {
                            success(res, 200,"Customer deleted Successfuly.",customerData);
                        }).catch(err => {
                            error(res, 500, err);
                        })
                    }
                    else
                    {
                        error(res, 404, "Customer not exists with this id");
                    }         
                })       
            }       
        } catch (err) {
            error(res, 500, err);
        }
    }
]

//update addres
exports.updateAddress = [
    body("addressId").isLength({ min: 1 }).trim().withMessage("Address id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                validation(res, errors.array()[0].msg, errors.array());
            }
            else
            {
                Address.findOne({ where: { address_id: req.body.addressId } }).then((data) =>{
                      if (data)
                      {
                        let updateData = { 
                            attention:req.body.attention,
                            address:req.body.address,
                            city:req.body.city,
                            state:req.body.state,
                            country:req.body.country,
                            zip_code:req.body.zip_code,
                            address_phone:req.body.address_phone,
                            type:req.body.type,
                        }
                        Address.update(updateData, { where: { address_id: req.body.addressId }}).then(addressdata =>{
                            success(res, 200,"Address updated Successfuly.", addressdata);
                        }).catch(err => {
                            error(res, 500, err);
                        });
                      }
                      else
                      {
                        error(res, 404, "Address not exists with this id");
                      }
                }).catch(err => {
                    error(res, 500, err);
                });    
            }
        } catch(err){
            error(res, 500, err);
        }
    }
]

//customer address details by id
exports.GetByAddressId = async (req, res) => {
    try {
        if (req.query.customerId =='')
        {
            customResponse(res, 1, 'Please provide customer id.');
        }
        else
        {
            const addressDetails = await Address.findOne({ where: { customer_id: req.query.customerId } });
            if(addressDetails)
            {
                const finalAddressDetails = await  getAddressResponseData(addressDetails)
                success(res,200,'Customer Details',finalAddressDetails)
            }
            else
            {
                customResponse(res,1,'No Address Found with this customer id in our system.');
            }
        }       
    } catch (err) {
        customResponse(res,1,err.message);
    }
}

//Address list
exports.getAllAddress = async (req, res) => {
    try
    {
        if (req.query.pageNum =='')
        {
            customResponse(res, 1, 'Please provide Page number.');
        }
        else
        {
            let pagingLimit = 10;
            let numberOfRows, numberOfPages;
            let numberPerPage = parseInt(pagingLimit,10) || 1;
            let pageNum = parseInt(req.query.pageNum, 10) || 1;
            let pagingOffset = (pageNum - 1) * numberPerPage;
            var offset = pagingLimit * ((parseInt(req.query.pageNum,10) - 1));
        
            var finalAddressList = []
            var finalDetails = {}

            Address.findAndCountAll({offset: pagingOffset, limit: pagingLimit}).then(async addressList => {
                numberOfRows = addressList.count
                numberOfPages = Math.ceil(parseInt(numberOfRows,10) / numberPerPage);
                const pagination ={
                    current: pageNum,
                    numberPerPage: numberPerPage,
                    has_previous: pageNum > 1,
                    previous: pageNum - 1,
                    has_next: pageNum < numberOfPages,
                    next: pageNum + 1,
                    last_page: Math.ceil(parseInt(numberOfRows,10) / pagingLimit)
                }
                allAddressList = addressList.rows
                for(let i=0; i< allAddressList.length; i++)
                {
                    const finalAddressDetails = await getAddressResponseData(allAddressList[i])
                    finalAddressList.push(finalAddressDetails)
                }
                finalDetails.pagination = pagination
                finalDetails.addressList = finalAddressList
                success(res,200,'Address List',finalDetails);
           }).catch(addressListError => {
               customResponse(res,1,addressListError)
           })
        }    
    }
    catch(err)
    {
        customResponse(res, 1, err);
    }
}

//Delete address
exports.deleteByAddressId = [
    async (req, res)=>{ 
        try{
            if(req.query.addressId =='')
            {
               customResponse(res, 1, 'Please provide Address id.');
            }
            else
            {
                var id = {address_id: req.query.addressId};

                Address.findOne({ where:id }).then((data) =>{
                    if(data)
                    {
                        let updateAddress = {is_deleted:1};
                        Address.update(updateAddress, { where: id }).then(addressData => {
                            success(res, 200,"Address deleted Successfuly.",addressData);
                        }).catch(err => {
                            error(res, 500, err);
                        })
                    }
                    else
                    {
                        error(res, 404, "Address not exists with this id");
                    }         
                })       
            }       
        } catch (err) {
            error(res, 500, err);
        }
    }
]