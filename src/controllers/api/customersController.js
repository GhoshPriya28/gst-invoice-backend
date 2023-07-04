const {Customers, Address, User} = require('../../sql-connections/models');
const { body,validationResult } = require("express-validator");
const {success,error,customResponse,validation} = require("../../helpers/response/api-response.js");
const {getCutomersResponseData, getAddressResponseData} = require('../../helpers/response/parse-response');
const { v4: uuidv4 } = require('uuid');

//add customer with address
exports.addCustomer = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User Id must be specified."),
    body("first_name").isLength({ min: 1 }).trim().withMessage("First Name must be specified.").isAlpha('es-ES', { ignore: ' ' }).withMessage("First Name must be alphabetic"),
    body("last_name").isLength({ min: 1 }).trim().withMessage("Last Name must be specified.").isAlpha('es-ES', { ignore: ' ' }).withMessage("Last Name must be alphabetic"),
    body("company_name").isLength({ min: 1 }).trim().withMessage("Company name must be specified."),
    body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified."),
    // .isEmail().withMessage("Email must be a valid email address.").custom((value) => {
    //     return Customers.findOne({
    //         where:
    //         {
    //             email: value
    //         }
    //     }).then((user) =>{
    //         if (user) 
    //         {
    //             return Promise.reject("E-mail already in use");
    //         }
    //     });
    // }),
    body("types").isLength({ min: 1 }).trim().withMessage("Business type must be specified."),

    async (req, res) =>{
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
            {
                customResponse(res, 1, errors.array()[0].msg);
            }
            else
            {
                await User.findOne({ where: { user_id: req.body.userId } }).then(async userDetails => {
                    if(!userDetails)
                    {
                        customResponse(res,1,"User not forunf in our system")
                    }
                    else
                    {
                        const customer = {
                            customer_id:uuidv4(),
                            user_id:req.body.userId?req.body.userId:"",
                            salutation:req.body.salutation?req.body.salutation:"",
                            first_name:req.body.first_name?req.body.first_name:"",
                            last_name:req.body.last_name?req.body.last_name:"",
                            display_name:req.body.display_name?req.body.display_name:"",
                            company_name:req.body.company_name?req.body.company_name:"",
                            email:req.body.email?req.body.email:"",
                            work_phone:req.body.work_phone?req.body.work_phone:"",
                            mobile:req.body.mobile?req.body.mobile:"",
                            pan:req.body.pan?req.body.pan:"",
                            types:req.body.types?req.body.types:"",
                            payment_terms:req.body.payment_terms?req.body.payment_terms:"",
                            gstin:req.body.gstin?req.body.gstin:"",
                            
                        }
                        await Customers.create(customer).then(async customerSaveDetails => {              
                            if(req.body.billing_address && req.body.shipping_address)
                            {
                                var address =[
                                    billing_address={
                                        address_id:uuidv4(),
                                        customer_id:customer.customer_id,
                                        attention:req.body.billing_address.attention?req.body.billing_address.attention:"",
                                        address:req.body.billing_address.address?req.body.billing_address.address:"",
                                        city:req.body.billing_address.city?req.body.billing_address.city:"",
                                        state:req.body.billing_address.state?req.body.billing_address.state:"",
                                        country:req.body.billing_address.country?req.body.billing_address.country:"",
                                        zip_code:req.body.billing_address.zip_code?req.body.billing_address.zip_code:0,
                                        address_phone:req.body.billing_address.address_phone?req.body.billing_address.address_phone:"",
                                        type:req.body.billing_address.type?req.body.billing_address.type:"",
                                    }, 
                                    shipping_address={
                                        address_id:uuidv4(),
                                        customer_id:customer.customer_id,
                                        attention:req.body.shipping_address.attention?req.body.shipping_address.attention:"",
                                        address:req.body.shipping_address.address?req.body.shipping_address.address:"",
                                        city:req.body.shipping_address.city?req.body.shipping_address.city:"",
                                        state:req.body.shipping_address.state?req.body.shipping_address.state:"",
                                        country:req.body.shipping_address.country?req.body.shipping_address.country:"",
                                        zip_code:req.body.shipping_address.zip_code?req.body.shipping_address.zip_code:0,
                                        address_phone:req.body.shipping_address.address_phone,
                                        type:req.body.shipping_address.type?req.body.shipping_address.type:"",
                                    } 
            
                                ]
                            }
                            else if(req.body.billing_address)
                            {
                                var address =[
                                    billing_address={
                                        address_id:uuidv4(),
                                        customer_id:customer.customer_id,
                                        attention:req.body.billing_address.attention?req.body.billing_address.attention:"",
                                        address:req.body.billing_address.address?req.body.billing_address.address:"",
                                        city:req.body.billing_address.city?req.body.billing_address.city:"",
                                        state:req.body.billing_address.state?req.body.billing_address.state:"",
                                        country:req.body.billing_address.country?req.body.billing_address.country:"",
                                        zip_code:req.body.billing_address.zip_code?req.body.billing_address.zip_code:0,
                                        address_phone:req.body.billing_address.address_phone?req.body.billing_address.address_phone:"",
                                        type:req.body.billing_address.type?req.body.billing_address.type:"",
                                    }]
                            }
                            else if(req.body.shipping_address)
                            {
                                var address =[
                                    shipping_address={
                                        address_id:uuidv4(),
                                        customer_id:customer.customer_id,
                                        attention:req.body.shipping_address.attention?req.body.shipping_address.attention:"",
                                        address:req.body.shipping_address.address?req.body.shipping_address.address:"",
                                        city:req.body.shipping_address.city?req.body.shipping_address.city:"",
                                        state:req.body.shipping_address.state?req.body.shipping_address.state:"",
                                        country:req.body.shipping_address.country?req.body.shipping_address.country:"",
                                        zip_code:req.body.shipping_address.zip_code?req.body.shipping_address.zip_code:0,
                                        address_phone:req.body.shipping_address.address_phone,
                                        type:req.body.shipping_address.type?req.body.shipping_address.type:"",
                                    }
                                ]
                            }
                            await Address.bulkCreate(address).then(async addressSaveDetails => {
                                success(res, 200,"Customer added Successfully.");
                            }).catch(err => {
                                error(res, 500, err);
                            })
                        }).catch(err => {
                            error(res, 500, err);
                        })
                    }
                }).catch(userDetaislError => {
                    customResponse(res,1,userDetaislError)
                })
            }
        }catch(err){
            error(res, 500, err);
        }
    }
];

//update customer
exports.updateCustomer = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User id must be specified."),
    body("customerId").isLength({ min: 1 }).trim().withMessage("Customer id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                customResponse(res, 1, errors.array()[0].msg);
            }
            else
            {
                await User.findOne({ where: { user_id: req.body.userId } }).then(async userDetails => {
                if(!userDetails)
                {
                    customResponse(res,1,"User Not Found in Our System.")
                }
                else
                {
                    Customers.findOne({ where: { customer_id: req.body.customerId, user_id: req.body.userId } }).then((data) =>{
                        if(data)
                        {
                            let updateData = { 
                                salutation:req.body.salutation, 
                                first_name:req.body.first_name, 
                                last_name:req.body.last_name,
                                display_name:req.body.display_name,
                                company_name:req.body.company_name, 
                                email:req.body.email, 
                                work_phone:req.body.work_phone,
                                mobile:req.body.mobile, 
                                pan:req.body.pan,
                                payment_terms:req.body.payment_terms,
                                types:req.body.types,
                                gstin:req.body.gstin

                                
                            }
                            Customers.update(updateData, { where: {customer_id: req.body.customerId, user_id: req.body.userId }}).then(customerdata =>{
                                Address.findOne({ where: { customer_id: req.body.customerId , type : 1} }).then((addressData) => {
                                    if(addressData) {
                                        let updateData = { 
                                            attention:req.body.billing_address.attention,
                                            address:req.body.billing_address.address,
                                            city:req.body.billing_address.city,
                                            state:req.body.billing_address.state,
                                            country:req.body.billing_address.country,
                                            zip_code:req.body.billing_address.zip_code,
                                            address_phone:req.body.billing_address.address_phone,
                                        }                        
                                        Address.update(updateData, { where: {customer_id: req.body.customerId , type : 1 }}).then(addressdata =>{
                                        }).catch(err => {
                                            error(res, 500, err);
                                        });
                                    }
                                    else
                                    {
                                      error(res, 404, "address not exist with this customer id");
                                    }
                                })
                                Address.findOne({ where: { customer_id: req.body.customerId , type : 2} }).then((addressData) => {
                                    if(addressData) {
                                        let updateData = { 
                                            attention:req.body.shipping_address.attention,
                                            address:req.body.shipping_address.address,
                                            city:req.body.shipping_address.city,
                                            state:req.body.shipping_address.state,
                                            country:req.body.shipping_address.country,
                                            zip_code:req.body.shipping_address.zip_code,
                                            address_phone:req.body.shipping_address.address_phone,
                                        }                        
                                        Address.update(updateData, { where: {customer_id: req.body.customerId , type : 2 }}).then(addressdata =>{ 
                                        }).catch(err => {
                                            error(res, 500, err);
                                        });
                                        success(res, 200,"Customer updated Successfully.");
                                    }
                                    else
                                    {
                                      error(res, 404, "address not exist with this customer id");
                                    }
                                })
                                //success(res, 200,"Cutomer updated Successfuly.", customerdata);
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
                }).catch(userDetaislError => {
                    customResponse(res,1, "User not found in our system.")
                })  
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
        if (req.query.pageNum =='' )
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

            await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                if(!userDetails)
                {
                    customResponse(res,1,"User Not Found in Our System.")
                }
                else
                {
                    Customers.findAndCountAll({where:{user_id:req.query.userId,is_deleted:'0'}, offset: pagingOffset, limit: pagingLimit, order: [['id', 'DESC']]}).then(async customerList => {
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
            }).catch(userDetaislError => {
                customResponse(res,1,userDetaislError)
            })
        }
    }
    catch(err)
    {
        customResponse(res, 1, err);
    }
}

//Customer Contact List
exports.getAllCustomersContact = async (req, res) => {
    try
    {
        await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
            if(!userDetails)
            {
                customResponse(res,1,"User Not Found in Our System.")
            }
            else
            {
                const customer = await Customers.findAll({where:{user_id: req.query.userId,}});
                success(res,200,'All Customers List', customer)
            }
        }).catch(userDetaislError => {
            customResponse(res,1,userDetaislError)
        })
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
            await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                if(!userDetails)
                {
                    customResponse(res,1,"User Not Found in Our System.")
                }
                else
                {
                    const customerDetails = await Customers.findOne({ where: { customer_id: req.query.customerId, user_id: req.query.userId } });
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
            }).catch(userDetaislError => {
                customResponse(res,1,userDetaislError)
            })
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
                await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                    if(!userDetails)
                    {
                        customResponse(res,1,"User Not Found in Our System.")
                    }
                    else
                    {  
                        Customers.findOne({where: {customer_id : req.query.customerId,user_id: req.query.userId}}).then((data) => {
                            if(data)
                            {
                                let updateCustomer = {is_deleted:1};
                                Customers.update(updateCustomer, { where: {customer_id : req.query.customerId,user_id: req.query.userId,is_deleted:'0'}}).then(customerData => {
                                    success(res, 200,"Customer deleted Successfully.",customerData);
                                }).catch(err => {
                                    error(res, 500, err);
                                })
                            }
                            else
                            {
                                error(res, 404, "Customer not exists with this id");
                            }         
                        }).catch(customerFindError => {
                            error(res, 500, customerFindError);
                        })
                    }
                }).catch(userDetaislError => {
                    customResponse(res,1,userDetaislError)
                })     
            }       
        } catch (err) {
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
            const addressDetails = await Address.findAll({ where: { customer_id: req.query.customerId } });
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
                            success(res, 200,"Address deleted Successfully.",addressData);
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