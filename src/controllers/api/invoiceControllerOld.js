require('dotenv').config();
const { Invoice, InvoiceItems, items, Customers, User,Taxes ,UserAccounts} = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { getInvoiceResponseData, getAllInvoiceResponseData } = require('../../helpers/response/parse-response');
const { v4: uuidv4 } = require('uuid');
const queryHelper = require("../../helpers/query/queryHelper.js");
const verifyToken = require("../../middlewares/auth/jwtAuth.js");
let ejs = require("ejs");
var html_to_pdf = require('html-pdf-node');
let path = require("path");
const { updatePdf } = require("../api/pdfTemplate.js")
const { Op } = require('sequelize')
// create
exports.addInvoiceOld = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User Id must be specified."),
    body("customerId").isLength({ min: 1 }).trim().withMessage("Customer Id must be specified."),
    body("invoiceDate").notEmpty().withMessage("Invoice Date must be specified.").isISO8601('yyyy-mm-dd').withMessage("Invoice Date must be yyyy-mm-dd format."),
    body("invoiceDueDate").notEmpty().withMessage("Due Date must be specified.").isISO8601('yyyy-mm-dd').withMessage("Due Date must be yyyy-mm-dd format."),
    verifyToken,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            else {      
                const itemArray = req.body.itemDetails
                const customerId = req.body.customerId
                const orderNumber = req.body.orderNumber
                const invoiceDate = req.body.invoiceDate
                const invoiceTerms = req.body.invoiceTerms
                const invoiceDueDate = req.body.invoiceDueDate
                const tax = (req.body.tax != "") ? req.body.tax : 0
                const taxType = req.body.taxType
                const customerNotes = req.body.customerNotes
                if (itemArray.length < 0) {
                    customResponse(res, 1, 'Please provide item list for invoice.')
                }
                else {
                    await User.findOne({ where: { user_id: req.body.userId } }).then(async userDetails => {
                        console.log("userDetails", userDetails);
                        if(userDetails)
                        {
                            let totalPrice = 0;
                            const invoiceId = 'INV-' + uuidv4();
                            const createInvoice = await Invoice.create({
                                user_id:req.body.userId,
                                inv_id: invoiceId,
                                customer_id: customerId,
                                // order_num: orderNumber,
                                inv_date: invoiceDate,
                                inv_terms: invoiceTerms,
                                due_date: invoiceDueDate,
                                inv_subject: customerNotes,
                                gst: tax,
                                gst_type: taxType
                            }).then(async invoiceAddDetails => {
                                for (let key of itemArray) {
                                    if (key.productId !== null && key.productId !== '') {
                                        const productDetails = await items.findOne({ where: { product_id: key.productId } })
                                        const insertDetails = await InvoiceItems.create({
                                            inv_id: invoiceId,
                                            product_id: key.productId,
                                            selling_price: productDetails.selling_price,
                                            quantity: key.quantity,
                                            subtotal_price: key.quantity * productDetails.selling_price,
                                        })
                                    }
                                }
                                success(res, 200, "Invoice Created Successfully.")
                            }).catch(invoiceAddError => {
                                customResponse(res, 1, invoiceAddError)
                            })
                        }
                        else
                        {
                            customResponse(res, 1, "Given User Id not exist in our system.")
                        }
                    })
                }            
            }
        }
        catch (err)
        {
            customResponse(res, 1, err);
        }
    }
];

// create invoice
exports.addInvoice = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User Id must be specified."),
    body("customerId").isLength({ min: 1 }).trim().withMessage("Customer Id must be specified."),
    body("invoiceDate").notEmpty().withMessage("Invoice Date must be specified.").isISO8601('yyyy-mm-dd').withMessage("Invoice Date must be yyyy-mm-dd format."),
    body("invoiceDueDate").notEmpty().withMessage("Due Date must be specified.").isISO8601('yyyy-mm-dd').withMessage("Due Date must be yyyy-mm-dd format."),
    verifyToken,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            else {
                const itemArray = req.body.itemDetails
                const customerId = req.body.customerId
                const purchaseOrder = req.body.purchaseOrder
                const orderNumber = req.body.orderNumber
                const invoiceDate = req.body.invoiceDate
                const invoiceTerms = req.body.invoiceTerms
                const invoiceDueDate = req.body.invoiceDueDate
                const tax = (req.body.tax != "") ? req.body.tax : 0
                const taxType = req.body.taxType
                const customerNotes = req.body.customerNotes
                if (itemArray.length < 0) {
                    customResponse(res, 1, 'Please provide item list for invoice.')
                }
                else {
                    await User.findOne({ where: { user_id: req.body.userId } }).then(async userDetails => {
                        if (userDetails) {
                            let totalPrice = 0;
                            const invoiceId = 'INV-' + uuidv4();
                            let displayInv = "NNC/"
                            const date = await queryHelper.date((date,lastId)=>{
                                displayInv+=date+'/'+lastId
                            })
                            //console.log("displayInv~~~~~~~~~~~",displayInv);
                            const createInvoice = await Invoice.create({
                                user_id: req.body.userId,
                                inv_id: invoiceId,
                                display_inv:displayInv,
                                customer_id: customerId,
                                purchase_order: purchaseOrder, 
                                order_number: orderNumber,
                                inv_date: invoiceDate,
                                inv_terms: invoiceTerms,
                                due_date: invoiceDueDate,
                                inv_subject: customerNotes,
                                gst: tax,
                                gst_type: taxType
                            }).then(async invoiceAddDetails => {
                                for (let key of itemArray) {
                                    if (key.productId !== null && key.productId !== '') {
                                        const productDetails = await items.findOne({ where: { product_id: key.productId } })
                                        const insertDetails = await InvoiceItems.create({
                                            inv_id: invoiceId,
                                            product_id: key.productId,
                                            selling_price: productDetails.selling_price,
                                            quantity: key.quantity,
                                            gst_percentage: key.gstPercentage,
                                            subtotal_price: key.quantity * productDetails.selling_price,
                                            taxable_price: (key.gstPercentage/100)*(key.quantity * productDetails.selling_price)
                                           // subtotal_price: (key.quantity * productDetails.selling_price) +((key.gstPercentage/100)*(key.quantity * productDetails.selling_price)),
                                        })
                                    }
                                }
                                success(res, 200, "Invoice Created Successfully.")
                            }).catch(invoiceAddError => {
                                customResponse(res, 1, invoiceAddError)
                            })
                        }
                        else {
                            customResponse(res, 1, "Given User Id not exist in our system.")
                        }
                    })
                }
            }
        }
        catch (err) {
            customResponse(res, 1, err);
        }
    }
];

//update
exports.updateInvoiceOld = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User id must be specified."),
    body("invoiceId").isLength({ min: 1 }).trim().withMessage("Invoice id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
            {
                customResponse(res, 1, errors.array()[0].msg)
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
                        const invoiceId = req.body.invoiceId
                        const itemArray = req.body.itemDetails;
                        const customerId = req.body.customerId
                        const orderNumber = req.body.orderNumber
                        const invoiceDate = req.body.invoiceDate
                        const invoiceTerms = req.body.invoiceTerms
                        const invoiceDueDate = req.body.invoiceDueDate
                        const tax = req.body.tax
                        const taxType = req.body.taxType
                        const customerNotes = req.body.customerNotes
                        var updateData = {}
                        Invoice.findOne({ where: { inv_id: invoiceId,user_id: req.body.userId } }).then((data) => {
                            if (data) {
                                if (customerId) {
                                    updateData.customer_id = customerId
                                }
                                // if (orderNumber) {
                                //     updateData.order_num = orderNumber
                                // }
                                if (invoiceDate) {
                                    updateData.inv_date = invoiceDate
                                }
                                if (invoiceTerms) {
                                    updateData.inv_terms = invoiceTerms
                                }
                                if (invoiceDueDate) {
                                    updateData.due_date = invoiceDueDate
                                }
                                if (customerNotes) {
                                    updateData.inv_subject = customerNotes
                                }
                                if (tax) {
                                    updateData.gst = tax
                                }
                                
                                updateData.gst_type = taxType
                                
                                Invoice.update(updateData, { where: { inv_id: invoiceId } }).then(async updateInv => {
                                    if(itemArray.length > 0)
                                    {
                                        for (let key of itemArray)
                                        {
                                            if (key.productId !== null && key.productId !== '')
                                            {
                                                const productDetails = await items.findOne({ where: { product_id: key.productId } })
                                                const checkData = await InvoiceItems.findOne({ where: { inv_id: invoiceId, product_id: key.productId } })
                                                if (checkData)
                                                {
                                                    let updateItem = {
                                                        subtotal_price: key.quantity * productDetails.selling_price,
                                                        selling_price: productDetails.selling_price,
                                                        quantity: key.quantity,
                                                    }
                                                    await InvoiceItems.update(updateItem, { where: { inv_id: invoiceId, product_id: key.productId } }).then(async updateInvItem => {
                                                        console.log('Update Invoice Item Details',updateInvItem)
                                                    }).catch(updateInvItemError => {
                                                        console.log('Update Invoice Item Error',updateInvItemError)
                                                    })
                                                }
                                                else
                                                {
                                                    let insertItem = {
                                                        inv_id: invoiceId,
                                                        product_id: key.productId,
                                                        selling_price: productDetails.selling_price,
                                                        quantity: key.quantity,
                                                        subtotal_price: key.quantity * productDetails.selling_price,
                                                    }
                                                    await InvoiceItems.create(insertItem).then(async insertInvItem => {
                                                        console.log('Insert Invoice Item Details',insertInvItem)
                                                    }).catch(insertInvItemError => {
                                                        console.log('Insert Invoice Item Error',insertInvItemError)
                                                    })
                                                }
                                            }
                                        }
                                        success(res, 200, "Invoice Updated Successfully.")
                                    }
                                    else
                                    {
                                        customResponse(res, 1, "Please provide Item Details.")
                                    }
                                }).catch(updateInvError => {
                                    customResponse(res,1,updateInvError)
                                })
                            }
                            else {
                                error(res, 404, "Invoice not exists with this id");
                            }
                        }).catch(err => {
                            error(res, 500, err);
                        });
                    }
                }).catch(userDetaislError => {
                    customResponse(res,1, "User not found in our system.")
                })  
            }
        } catch (err) {
            error(res, 500, err);
        }
    }
]

//update
exports.updateInvoice = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User id must be specified."),
    body("invoiceId").isLength({ min: 1 }).trim().withMessage("Invoice id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            else {
                await User.findOne({ where: { user_id: req.body.userId } }).then(async userDetails => {
                    if (!userDetails) {
                        customResponse(res, 1, "User Not Found in Our System.")
                    }
                    else {
                        const invoiceId = req.body.invoiceId
                        const itemArray = req.body.itemDetails;
                        const customerId = req.body.customerId
                        const purchaseOrder = req.body.purchaseOrder
                        const orderNumber = req.body.orderNumber
                        const invoiceDate = req.body.invoiceDate
                        const invoiceTerms = req.body.invoiceTerms
                        const invoiceDueDate = req.body.invoiceDueDate
                        const tax = req.body.tax
                        const taxType = req.body.taxType
                        const customerNotes = req.body.customerNotes
                        var updateData = {}
                        Invoice.findOne({ where: { inv_id: invoiceId, user_id: req.body.userId } }).then((data) => {
                            if (data) {
                                if (customerId) {
                                    updateData.customer_id = customerId
                                }
                                if (purchaseOrder) {
                                    updateData.purchase_order = purchaseOrder
                                }
                                if (orderNumber) {
                                    updateData.order_number = orderNumber
                                }
                                if (invoiceDate) {
                                    updateData.inv_date = invoiceDate
                                }
                                if (invoiceTerms) {
                                    updateData.inv_terms = invoiceTerms
                                }
                                if (invoiceDueDate) {
                                    updateData.due_date = invoiceDueDate
                                }
                                if (customerNotes) {
                                    updateData.inv_subject = customerNotes
                                }
                                if (tax) {
                                    updateData.gst = tax
                                }

                                updateData.gst_type = taxType

                                Invoice.update(updateData, { where: { inv_id: invoiceId } }).then(async updateInv => {
                                    if (itemArray.length > 0) {
                                        for (let key of itemArray) {
                                            if (key.productId !== null && key.productId !== '') {
                                                const productDetails = await items.findOne({ where: { product_id: key.productId } })
                                                const checkData = await InvoiceItems.findOne({ where: { inv_id: invoiceId, product_id: key.productId } })
                                                if (checkData) {
                                                    let updateItem = {
                                                        subtotal_price: key.quantity * productDetails.selling_price,
                                                        selling_price: productDetails.selling_price,
                                                        quantity: key.quantity,
                                                        gst_percentage: key.gstPercentage,
                                                        taxable_price: (key.gstPercentage/100)*(key.quantity * productDetails.selling_price)
                                                    }
                                                    await InvoiceItems.update(updateItem, { where: { inv_id: invoiceId, product_id: key.productId } }).then(async updateInvItem => {
                                                        console.log('Update Invoice Item Details', updateInvItem)
                                                    }).catch(updateInvItemError => {
                                                        console.log('Update Invoice Item Error', updateInvItemError)
                                                    })
                                                }
                                                else {
                                                    let insertItem = {
                                                        inv_id: invoiceId,
                                                        product_id: key.productId,
                                                        selling_price: productDetails.selling_price,
                                                        quantity: key.quantity,
                                                        subtotal_price: key.quantity * productDetails.selling_price,
                                                        gst_percentage: key.gstPercentage,
                                                        taxable_price: (key.gstPercentage/100)*(key.quantity * productDetails.selling_price)
                                                    }
                                                    await InvoiceItems.create(insertItem).then(async insertInvItem => {
                                                        console.log('Insert Invoice Item Details', insertInvItem)
                                                    }).catch(insertInvItemError => {
                                                        console.log('Insert Invoice Item Error', insertInvItemError)
                                                    })
                                                }
                                            }
                                        }
                                        success(res, 200, "Invoice Updated Successfully.")
                                    }
                                    else {
                                        customResponse(res, 1, "Please provide Item Details.")
                                    }
                                }).catch(updateInvError => {
                                    customResponse(res, 1, updateInvError)
                                })
                            }
                            else {
                                error(res, 404, "Invoice not exists with this id");
                            }
                        }).catch(err => {
                            error(res, 500, err);
                        });
                    }
                }).catch(userDetaislError => {
                    customResponse(res, 1, "User not found in our system.")
                })
            }
        } catch (err) {
            error(res, 500, err);
        }
    }
]

//get all
exports.getAllInvoiceOld = async (req, res) => {
    try {
        let pagingLimit = 10;
        let numberOfRows, numberOfPages;
        let numberPerPage = parseInt(pagingLimit, 10) || 1;
        let pageNum = parseInt(req.query.pageNum, 10) || 1;
        let pagingOffset = (pageNum - 1) * numberPerPage;
        var offset = pagingLimit * ((parseInt(req.query.pageNum, 10) - 1));
        var finalInvoiceList = []
        var finalDetails = {}
        if (req.query.userId == '')
        {
            customResponse(res, 1, 'Please provide User Id.');
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
                    Invoice.findAndCountAll({where: { user_id:req.query.userId , is_deleted : 0 }, offset: pagingOffset, limit: pagingLimit, order: [['id', 'DESC']]}).then(async invoiceList => {
                        if(invoiceList)
                        {
                            numberOfRows = invoiceList.count
                            numberOfPages = Math.ceil(parseInt(numberOfRows, 10) / numberPerPage);
                            const pagination = {
                                current: pageNum,
                                numberPerPage: numberPerPage,
                                has_previous: pageNum > 1,
                                previous: pageNum - 1,
                                has_next: pageNum < numberOfPages,
                                next: pageNum + 1,
                                last_page: Math.ceil(parseInt(numberOfRows, 10) / pagingLimit)
                            }
                            allInvoiceList = invoiceList.rows
                            for (let i = 0; i < allInvoiceList.length; i++)
                            {
                                const finalInvoiceDetails = await getAllInvoiceResponseData(allInvoiceList[i])
                                finalInvoiceList.push(finalInvoiceDetails)
                            }
                            finalDetails.pagination = pagination
                            finalDetails.invoiceList = finalInvoiceList
                            success(res, 200, 'Invoice List', finalDetails)
                        }
                        else
                        {
                            customResponse(res, 1, "user id not found")
                        }
                    }).catch(invoiceListError => {
                        customResponse(res, 1, invoiceListError)
                    })
                }
            }).catch(userDetaislError => {
                customResponse(res,1, "User not found in our system.")
            }) 

        }
    }
    catch (err)
    {
        customResponse(res, 1, err);
    }
}

//get all
exports.getAllInvoice = async (req, res) => {
    try {
        let pagingLimit = 10;
        let numberOfRows, numberOfPages;
        let numberPerPage = parseInt(pagingLimit, 10) || 1;
        let pageNum = parseInt(req.query.pageNum, 10) || 1;
        let pagingOffset = (pageNum - 1) * numberPerPage;
        var offset = pagingLimit * ((parseInt(req.query.pageNum, 10) - 1));
        var finalInvoiceList = []
        var finalDetails = {}
        if (req.query.userId == '') {
            customResponse(res, 1, 'Please provide User Id.');
        }
        else {
            await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                if (!userDetails) {
                    customResponse(res, 1, "User Not Found in Our System.")
                }
                else {
                    Invoice.findAndCountAll({ where: { user_id: req.query.userId, is_deleted: 0 }, offset: pagingOffset, limit: pagingLimit, order: [['id', 'DESC']] }).then(async invoiceList => {
                        if (invoiceList) {
                            numberOfRows = invoiceList.count
                            numberOfPages = Math.ceil(parseInt(numberOfRows, 10) / numberPerPage);
                            const pagination = {
                                current: pageNum,
                                numberPerPage: numberPerPage,
                                has_previous: pageNum > 1,
                                previous: pageNum - 1,
                                has_next: pageNum < numberOfPages,
                                next: pageNum + 1,
                                last_page: Math.ceil(parseInt(numberOfRows, 10) / pagingLimit)
                            }
                            allInvoiceList = invoiceList.rows
                            for (let i = 0; i < allInvoiceList.length; i++) {
                                const finalInvoiceDetails = await getAllInvoiceResponseData(allInvoiceList[i])
                                finalInvoiceList.push(finalInvoiceDetails)
                            }
                            finalDetails.pagination = pagination
                            finalDetails.invoiceList = finalInvoiceList
                            success(res, 200, 'Invoice List', finalDetails)
                        }
                        else {
                            customResponse(res, 1, "user id not found")
                        }
                    }).catch(invoiceListError => {
                        customResponse(res, 1, invoiceListError)
                    })
                }
            }).catch(userDetaislError => {
                customResponse(res, 1, "User not found in our system.")
            })

        }
    }
    catch (err) {
        customResponse(res, 1, err);
    }
}

//get by inv id
exports.GetByInvoiceId = async (req, res) => {
    try {
        if (req.query.inv_id == '' && req.query.userId == '') {
            customResponse(res, 1, 'Please provide Invoice & User Id.');
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
                    const invoiceDetails = await Invoice.findOne({ where: { inv_id: req.query.inv_id, user_id:req.query.userId, is_deleted : 0 } });
                    if (invoiceDetails) {
                        const finalInvoiceDetails = await getInvoiceResponseData(invoiceDetails)
                        success(res, 200, 'Invoice Details', finalInvoiceDetails)
                    }
                    else {
                        customResponse(res, 1, 'Invoice not found with this id in our system.');
                    }
                }
            }).catch(userDetaislError => {
                customResponse(res,1, "User not found in our system.")
            }) 
        }
    } catch (err) {
        customResponse(res, 1, err.message);
    }
}
//delete by inv id
exports.deleteByInvoiceId = [
    async (req, res) => {
        try {
            if (req.query.inv_id == ''  && req.query.userId == '') {
                customResponse(res, 1, 'Please provide Invoice & User Id.');
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
                        Invoice.findOne({ where: { inv_id: req.query.inv_id, user_id:req.query.userId } }).then((data) => {
                            if (data) {
                                let updateInvoice = { is_deleted: 1 };
                                Invoice.update(updateInvoice, { where: { inv_id: req.query.inv_id} }).then(invoicedata => {
                                    success(res, 200, "Invoice deleted Successfuly.");
                                }).catch(err => {
                                    error(res, 500, err);
                                })
                            }
                            else {
                                error(res, 404, "Invoice not exists with this id");
                            }
                        }).catch(invoiceFindError => {
                            customResponse(res,1, invoiceFindError)
                        })
                    }
                }).catch(userDetaislError => {
                    customResponse(res,1, "User not found in our system.")
                })
            }
        } catch (err) {
            error(res, 500, err);
        }
    }
]

//invoice gen
exports.InvoiceGenerateOld = [async (req, res) => {

    if(req.query.inv_id == "")
    {
        customResponse(res,1,"Please Provide Invoice Id.")
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
                const invoiceDetails = await Invoice.findOne({where:{inv_id: req.query.inv_id,user_id: req.query.userId}});
                if (invoiceDetails)
                {            
                    const invoiceItemsDetails = await InvoiceItems.findAll({where:{inv_id: req.query.inv_id,quantity:{[Op.gt]:0}}});
                    const customerDetails = await queryHelper.getCustomerDetailsByInvoiceId(req.query.inv_id);
                    const invoiceTotalAmount = await queryHelper.getSumofSellingPriceByInvoiceId(req.query.inv_id);
                    var finalItemDetails = []
                    var invoiceGstAmounts = 0
                    var invoicetotalAmountss = 0
                    if(invoiceDetails.gst_type == 'tds')
                    {
                        let gstAmount = invoiceTotalAmount*0.2
                        invoiceGstAmounts = parseInt(gstAmount)

                        let totalAmount = parseInt(invoiceGstAmounts,10) + parseInt(invoiceTotalAmount,10)
                        invoicetotalAmountss = parseInt(totalAmount,10)

                    }
                    else if(invoiceDetails.gst_type == 'tcs')
                    {
                        let gstAmount = invoiceTotalAmount*0.1
                        invoiceGstAmounts = parseInt(gstAmount,10)

                        let totalAmount = parseInt(invoiceGstAmounts,10) + parseInt(invoiceTotalAmount,10)
                        invoicetotalAmountss = parseInt(totalAmount,10)
                    }
                    else
                    {
                        let gstAmount = 0
                        invoiceGstAmounts = parseInt(gstAmount)

                        let totalAmount = parseInt(invoiceGstAmounts,10) + parseInt(invoiceTotalAmount,10)
                        invoicetotalAmountss = parseInt(totalAmount,10)
                    }

                    console.log('Invoice Total Amount',invoicetotalAmountss)

                    let finalInvoiceDetails = {
                        invoiceId : invoiceDetails.inv_id,
                        customerName : customerDetails.salutation+' '+customerDetails.first_name+' '+customerDetails.last_name,
                        companyName : customerDetails.company_name,
                        customerEmail : customerDetails.email,
                        invoiceDate : invoiceDetails.inv_date,
                        invoiceDueDate : invoiceDetails.due_date,
                        invoiceTotal : parseInt(invoiceTotalAmount,10),
                        invoiceGstType : invoiceDetails.gst_type,
                        invoiceGst : (invoiceDetails.gst_type == 'tds')?20:((invoiceDetails.gst_type == 'tcs')?10:0),
                        invoiceGstAmount : invoiceGstAmounts,
                        invoiceTotalAmounts : invoicetotalAmountss,
                    }

                    for(const itemDetails of invoiceItemsDetails)
                    {
                        let item = {
                            itemName : await queryHelper.getProductNameById(itemDetails.product_id),
                            itemDescription : await queryHelper.getProductDescriptionById(itemDetails.product_id),
                            itemPrice : itemDetails.selling_price,
                            itemQuantity : itemDetails.quantity,
                            itemSubtotal : itemDetails.subtotal_price
                        }

                        finalItemDetails.push(item)
                    }


                    finalInvoiceDetails.itemDetails = finalItemDetails
                    console.log('Invoice Details',finalInvoiceDetails)

                    const invoicePdfData = await updatePdf(finalInvoiceDetails);
                    const invoiceName = req.query.inv_id+'-'+uuidv4()+'-invoice.pdf'
                    const invoicePath = path.join(process.cwd(), 'public/invoices',invoiceName)
                    let options = {path : invoicePath };
                    let file = { content: invoicePdfData, name : invoiceName};
                    await html_to_pdf.generatePdf(file,options, function (err, data) {
                        if (err)
                        {
                            customResponse(res,1,err)
                        }
                        else
                        {
                            let invoiceData = {
                                invoiceLink : process.env.BASE_URL+'invoices/'+invoiceName,
                                invoiceView : invoicePdfData
                            }
                            success(res,200,"Invoice Created Scuuessfully.",invoiceData)
                        }
                    });
                }
                else
                {
                    customResponse(res,1,"This invoice id not found in system.")
                }
            }
        }).catch(userDetaislError => {
            customResponse(res,1, userDetaislError)
        })
    }
}]

//invoice gen
exports.InvoiceGenerate = [async (req, res) => {

    if (req.query.inv_id == "") {
        customResponse(res, 1, "Please Provide Invoice Id.")
    }
    else {
        await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
            if (!userDetails) {
                customResponse(res, 1, "User Not Found in Our System.")
            }
            else {
                const invoiceDetails = await Invoice.findOne({ where: { inv_id: req.query.inv_id, user_id: req.query.userId } });
                if (invoiceDetails) {
                    const invoiceItemsDetails = await InvoiceItems.findAll({ where: { inv_id: req.query.inv_id, quantity: { [Op.gt]: 0 } } });
                    const customerDetails = await queryHelper.getCustomerDetailsByInvoiceId(req.query.inv_id);
                    const invoiceTotalAmount = await queryHelper.getSumofSellingPriceByInvoiceId(req.query.inv_id);
                    const invoiceTotalTaxAmount = await queryHelper.getSumofTaxablePriceByInvoiceId(req.query.inv_id)
                    var finalItemDetails = []
                    var invoiceGstAmounts = 0
                    var invoicetotalAmountss = 0
                    if (invoiceDetails.gst_type == 'igst') {
                        let gstAmount = invoiceTotalAmount 
                        invoiceGstAmounts = parseInt(gstAmount)

                        let totalAmount =  parseInt(invoiceTotalAmount, 10) + parseInt(invoiceTotalTaxAmount, 10)
                        invoicetotalAmountss = parseInt(totalAmount, 10)

                    }
                    else if (invoiceDetails.gst_type == 'cgst' || 'sgst') {
                        let gstAmount = invoiceTotalAmount 
                        invoiceGstAmounts = parseInt(gstAmount, 10)

                        let totalAmount =  parseInt(invoiceTotalAmount, 10) + parseInt(invoiceTotalTaxAmount, 10)
                        invoicetotalAmountss = parseInt(totalAmount, 10)
                    }
                    
                    else {
                        let gstAmount = 0
                        invoiceGstAmounts = parseInt(gstAmount)

                        let totalAmount =  parseInt(invoiceTotalAmount, 10) + parseInt(invoiceTotalTaxAmount, 10)
                        invoicetotalAmountss = parseInt(totalAmount, 10)
                    }

                    console.log('Invoice Total Amount', invoicetotalAmountss)

                    let finalInvoiceDetails = {
                        //invoiceId: invoiceDetails.inv_id,
                        invoiceId: invoiceDetails.display_inv,
                        customerName: customerDetails.salutation + ' ' + customerDetails.first_name + ' ' + customerDetails.last_name,
                        companyName: customerDetails.company_name,
                        companyGSTIN: customerDetails.gstin,
                        customerEmail: customerDetails.email,
                        invoiceDate: invoiceDetails.inv_date,
                        invoiceDueDate: invoiceDetails.due_date,
                        invoiceTotal: parseInt(invoiceTotalAmount, 10),
                        invoiceGstType: invoiceDetails.gst_type,
                        //invoiceGst: (invoiceDetails.gst_type == 'tds') ? 20 : ((invoiceDetails.gst_type == 'tcs') ? 10 : 0),
                        invoiceGstAmount: invoiceGstAmounts,
                        invoiceTotalAmounts: invoicetotalAmountss,
                    }

                    for (const itemDetails of invoiceItemsDetails) {
                        let item = {
                            itemName: await queryHelper.getProductNameById(itemDetails.product_id),
                            itemDescription: await queryHelper.getProductDescriptionById(itemDetails.product_id),
                            itemPrice: itemDetails.selling_price,
                            itemQuantity: itemDetails.quantity,
                            itemGstPercentage: itemDetails.gst_percentage,
                            itemSubtotal: itemDetails.subtotal_price,
                            taxSubtotal: itemDetails.taxable_price
                        }

                        finalItemDetails.push(item)
                    }


                    finalInvoiceDetails.itemDetails = finalItemDetails
                    console.log('Invoice Details', finalInvoiceDetails)

                    const invoicePdfData = await updatePdf(finalInvoiceDetails);
                    const invoiceName = req.query.inv_id + '-' + uuidv4() + '-invoice.pdf'
                    const invoicePath = path.join(process.cwd(), 'public/invoices', invoiceName)
                    let options = { path: invoicePath };
                    let file = { content: invoicePdfData, name: invoiceName };
                    await html_to_pdf.generatePdf(file, options, function (err, data) {
                        if (err) {
                            customResponse(res, 1, err)
                        }
                        else {
                            let invoiceData = {
                                invoiceLink: process.env.BASE_URL + 'invoices/' + invoiceName,
                                invoiceView: invoicePdfData
                            }
                            success(res, 200, "Invoice Created Scuuessfully.", invoiceData)
                        }
                    });
                }
                else {
                    customResponse(res, 1, "This invoice id not found in system.")
                }
            }
        }).catch(userDetaislError => {
            customResponse(res, 1, userDetaislError)
        })
    }
}]

exports.taxList = [
    async (req, res) => {
        try {
            const taxList = await Taxes.findAll()
            if (taxList) {
                success(res, 200, "Tax Lists.", taxList);
            }
        }
        catch (err) {
            customResponse(res, 1, err);
        }
    }
];



exports.userAccount =[async (req, res) => {
    if(req.query.user_id == "")
    {
        customResponse(res,1,"Please Provide user Id.")
    }
    else
    {
        const AccountDetailsList = await UserAccounts.findAll({where:{user_id: req.query.userId,status: 0}});
        var accountData=[];
        if(AccountDetailsList.length>0)
        {

            for(const AccountDetails of AccountDetailsList)
            {
                 accountDataa= {
                    id : AccountDetails.id?AccountDetails.id:'',
                    user_id : AccountDetails.user_id?AccountDetails.user_id:'',
                    bank_name : AccountDetails.bank_name?AccountDetails.bank_name:'',
                    ifsc_code : AccountDetails.ifsc_code?AccountDetails.ifsc_code:'',
                    account_number : AccountDetails.account_number?AccountDetails.account_number:'',
                    account_holder : AccountDetails.account_holder?AccountDetails.account_holder:'',
                    account_email : AccountDetails.account_email?AccountDetails.account_email:'',
                    address : AccountDetails.address?AccountDetails.address:'',
                   
                }

                accountData.push(accountDataa);

            }
            

            success(res,200,"Account Details.",accountData)
        }
        else
        {
            success(res,200,"Account Details.",accountData)
        }
    }
}];


exports.addAccouns = [
    body("user_id").isLength({ min: 1 }).trim().withMessage("User Id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            else
            {
                if(req.body.bankDetails)
                {
                    for(const AccountDetails of req.body.bankDetails)
                    {
                        if(AccountDetails.id)
                        {
                            //Update
                            const account = {
                                user_id:req.body.user_id?req.body.user_id:'',
                                bank_name:AccountDetails.bank_name?AccountDetails.bank_name:'',
                                ifsc_code:AccountDetails.ifsc_code  ?AccountDetails.ifsc_code   :'',
                                account_number:AccountDetails.account_number?AccountDetails.account_number:'',
                                account_holder:AccountDetails.account_holder?AccountDetails.account_holder:'',
                                account_email:AccountDetails.account_email?AccountDetails.account_email:'',
                                address:AccountDetails.address?AccountDetails.address:''
                            }

                            UserAccounts.update(account, { where: { id: AccountDetails.id } }).then(async updateInv => {
                                success(res, 200,"Account updated Successfuly.");
                            }).catch(err => {
                                error(res, 500, err);
                            })

                        }
                        else
                        {
                            //Insert
                            const account = {
                                user_id:req.body.user_id?req.body.user_id:'',
                                bank_name:AccountDetails.bank_name?AccountDetails.bank_name:'',
                                ifsc_code:AccountDetails.ifsc_code  ?AccountDetails.ifsc_code   :'',
                                account_number:AccountDetails.account_number?AccountDetails.account_number:'',
                                account_holder:AccountDetails.account_holder?AccountDetails.account_holder:'',
                                account_email:AccountDetails.account_email?AccountDetails.account_email:'',
                                address:AccountDetails.address?AccountDetails.address:''
                            }
                            await UserAccounts.create(account).then(async customerSaveDetails => {
                                success(res, 200,"Account added Successfuly.");
                            }).catch(err => {
                                error(res, 500, err);
                            })
                            
                        }
                    }
                }
                
            }

        }
        catch (err)
        {
            customResponse(res, 1, err);
        }
}
];


//delete account
//delete account
exports.deleteAccounts = [
    async (req, res) => {
        try {
            if (req.query.user_id == '' && req.query.id == '') {
                customResponse(res, 1, 'Please provide userId, Id.');
            }
            else {
                UserAccounts.findOne({ where: { user_id: req.query.user_id, id: req.query.id, status: 0 } }).then((data) => {
                    if (data) {
                        let updateUpi = { status: 1 };
                        UserAccounts.update(updateUpi, { where: { user_id: req.query.user_id, id: req.query.id } }).then(accountData => {
                            success(res, 200, "Account deleted Successfuly.");
                        }).catch(err => {
                            error(res, 500, err);
                        })
                    }
                    else {
                        error(res, 404, "Account not exists with this id");
                    }
                })
            }
        } catch (err) {
            error(res, 500, err);
        }
    }
]









