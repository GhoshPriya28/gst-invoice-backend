require('dotenv').config();
const { Invoice, InvoiceItems, items, Customers } = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { getInvoiceResponseData, getAllInvoiceResponseData } = require('../../helpers/response/parse-response');
const { v4: uuidv4 } = require('uuid');

// create
exports.addInvoice = [
    body("customerId").isLength({ min: 1 }).trim().withMessage("Customer Id must be specified."),
    body("orderNumber").isLength({ min: 1 }).trim().withMessage("Order Number must be specified."),
    body("invoiceDate").notEmpty().withMessage("Invoice Date must be specified.").isISO8601('yyyy-mm-dd').withMessage("Invoice Date must be yyyy-mm-dd format."),
    body("invoiceTerms").isLength({ min: 1 }).trim().withMessage("Customer Id must be specified."),
    body("invoiceDueDate").notEmpty().withMessage("Due Date must be specified.").isISO8601('yyyy-mm-dd').withMessage("Due Date must be yyyy-mm-dd format."),
    body("tax").isLength({ min: 1 }).trim().withMessage("Tax must be specified."),
    body("taxType").isLength({ min: 1 }).trim().withMessage("Tax Type must be specified."),
    body("customerNotes").isLength({ min: 1 }).trim().withMessage("Customer Notes must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            else {
                const itemArray = req.body.itemDetails
                const customerId = req.body.customerId
                const orderNumber = req.body.orderNum
                const invoiceDate = req.body.invoiceDate
                const invoiceTerms = req.body.invoiceTerms
                const invoiceDueDate = req.body.invoiceDueDate
                const tax = req.body.tax
                const taxType = req.body.taxType
                const customerNotes = req.body.customerNotes

                if (itemArray.length < 0) {
                    customResponse(res, 1, 'Please provide item list for invoice.')
                }
                else {
                    let totalPrice = 0;
                    const invoiceId = 'INV-' + uuidv4();
                    const createInvoice = await Invoice.create({
                        inv_id: invoiceId,
                        customer_id: customerId,
                        order_num: orderNumber,
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
            }
        }
        catch (err) {
            customResponse(res, 1, err);
        }
    }
];

//update
exports.updateInvoice = [
    body("invoiceId").isLength({ min: 1 }).trim().withMessage("Invoice id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }

            const invoiceId = req.body.invoiceId
            const itemArray = req.body.itemDetails;
            const customerId = req.body.customerId
            const orderNumber = req.body.orderNum
            const invoiceDate = req.body.invoiceDate
            const invoiceTerms = req.body.invoiceTerms
            const invoiceDueDate = req.body.invoiceDueDate
            const tax = req.body.tax
            const taxType = req.body.taxType
            const customerNotes = req.body.customerNotes
            var updateData = {}

            Invoice.findOne({ where: { inv_id: invoiceId } }).then((data) => {
                if (data) {
                    if (customerId) {
                        updateData.customer_id = customerId
                    }
                    if (orderNumber) {
                        updateData.order_num = orderNumber
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
                    if (taxType) {
                        updateData.gst_type = taxType
                    }
                    const updateInv = Invoice.update(updateData, { where: { inv_id: invoiceId } })
                    if (updateInv) {
                        if (itemArray.length > 0) {
                            for (let key of itemArray) {
                                if (key.productId !== null && key.productId !== '') {
                                    const checkData = InvoiceItems.findOne({ where: { inv_id: invoiceId, product_id: key.productId } })
                                    if (checkData) {
                                        let updateItem = {
                                            subtotal_price: key.quantity * checkData.selling_price,
                                            selling_price: checkData.selling_price,
                                            quantity: key.quantity,
                                        }
                                        const updateInvItem = InvoiceItems.update(updateItem, { where: { inv_id: req.body.inv_id, product_id: key.product_id } })
                                    }
                                }
                            }
                            success(res, 200, "Invoice Updated Successfully.")
                        }
                    }
                }
                else {
                    error(res, 404, "Invoice not exists with this id");
                }
            }).catch(err => {
                error(res, 500, err);
            });

        } catch (err) {
            error(res, 500, err);
        }
    }
]


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
        Invoice.findAndCountAll({ offset: pagingOffset, limit: pagingLimit }).then(async invoiceList => {
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
        }).catch(invoiceListError => {
            customResponse(res, 1, invoiceListError)
        })
    }
    catch (err) {
        customResponse(res, 1, err);
    }
}

//get by inv id
exports.GetByInvoiceId = async (req, res) => {
    try {
        if (req.query.inv_id == '') {
            customResponse(res, 1, 'Please provide invoice id.');
        }
        else {
            const invoiceDetails = await Invoice.findOne({ where: { inv_id: req.query.inv_id } });
            if (invoiceDetails) {
                const finalInvoiceDetails = await getInvoiceResponseData(invoiceDetails)
                success(res, 200, 'Invoice Details', finalInvoiceDetails)
            }
            else {
                customResponse(res, 1, 'No Invoice Found with this invoice id in our system.');
            }
        }
    } catch (err) {
        customResponse(res, 1, err.message);
    }
}

//delete by inv id
exports.deleteByInvoiceId = [
    async (req, res) => {
        try {
            if (req.query.inv_id == '') {
                customResponse(res, 1, 'Please provide invoice id.');
            }
            else {
                var id = { inv_id: req.query.inv_id };

                Invoice.findOne({ where: id }).then((data) => {
                    if (data) {
                        let updateInvoice = { is_deleted: 1 };
                        Invoice.update(updateInvoice, { where: id }).then(invoicedata => {
                            success(res, 200, "Invoice deleted Successfuly.", invoicedata);
                        }).catch(err => {
                            error(res, 500, err);
                        })
                    }
                    else {
                        error(res, 404, "Invoice not exists with this id");
                    }
                })
            }
        } catch (err) {
            error(res, 500, err);
        }
    }
]