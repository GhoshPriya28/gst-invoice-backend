require('dotenv').config();
const { Invoice, InvoiceItems, items, Customers, User, Taxes, UserAccounts } = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { getInvoiceResponseData, getAllInvoiceResponseData, getLogoResponseData } = require('../../helpers/response/parse-response');
const { v4: uuidv4 } = require('uuid');
const queryHelper = require("../../helpers/query/queryHelper.js");
const verifyToken = require("../../middlewares/auth/jwtAuth.js");
let ejs = require("ejs");
var html_to_pdf = require('html-pdf-node');
let path = require("path");
const { updatePdf } = require("./pdfTemplate.js")
const { Op } = require('sequelize');
const { parse } = require('path');
const uploadFile = require("../../middlewares/uploads/uploads.js")
var converter = require('number-to-words');


const moment = require('moment');

// create invoice
exports.addInvoice = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User Id must be specified."),
    body("customerId").isLength({ min: 1 }).trim().withMessage("Customer Id must be specified."),
    body("invoiceId").isLength({ min: 1 }).trim().withMessage("Invoice Id must be specified."),
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
                            const invoiceUniqueId = uuidv4();
                            let displayInv = "NNC/"
                            const date = await queryHelper.date((date, lastId) => {
                                displayInv += date + '/' + lastId
                            })
                            //console.log("displayInv~~~~~~~~~~~",displayInv);
                            const createInvoice = await Invoice.create({
                                user_id: req.body.userId,
                                inv_id: req.body.invoiceId,
                                inv_uni_id: invoiceUniqueId,
                                // display_inv: displayInv,
                                customer_id: customerId,
                                purchase_order: purchaseOrder,
                                order_number: orderNumber,
                                inv_date: invoiceDate,
                                inv_terms: invoiceTerms,
                                due_date: invoiceDueDate,
                                inv_subject: customerNotes,
                                gst: tax,
                                gst_type: taxType,

                            }).then(async invoiceAddDetails => {
                                for (let key of itemArray) {
                                    if (key.productId !== null && key.productId !== '') {
                                        const productDetails = await items.findOne({ where: { product_id: key.productId } })
                                        const insertDetails = await InvoiceItems.create({
                                            inv_id: req.body.invoiceId,
                                            inv_uni_id: invoiceUniqueId,
                                            product_id: key.productId,
                                            selling_price: productDetails.selling_price,
                                            quantity: key.quantity,
                                            gst_percentage: key.gstPercentage,
                                            description: key.description,
                                            subtotal_price: key.quantity * productDetails.selling_price,
                                            taxable_price: (key.gstPercentage / 100) * (key.quantity * productDetails.selling_price)
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
exports.updateInvoice = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User id must be specified."),
    body("invoiceId").isLength({ min: 1 }).trim().withMessage("Invoice id must be specified."),
    body("invoiceUniId").isLength({ min: 1 }).trim().withMessage("Invoice Unique Id must be specified."),
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
                        const invoiceUniId = req.body.invoiceUniId
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
                        Invoice.findOne({ where: { inv_id: invoiceId, inv_uni_id: invoiceUniId, user_id: req.body.userId } }).then((data) => {
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

                                Invoice.update(updateData, { where: { inv_id: invoiceId, inv_uni_id: invoiceUniId } }).then(async updateInv => {
                                    if (itemArray.length > 0) {
                                        for (let key of itemArray) {
                                            if (key.productId !== null && key.productId !== '') {
                                                const productDetails = await items.findOne({ where: { product_id: key.productId } })
                                                const checkData = await InvoiceItems.findOne({ where: { inv_id: invoiceId, inv_uni_id: invoiceUniId, product_id: key.productId } })
                                                if (checkData) {
                                                    let updateItem = {
                                                        subtotal_price: key.quantity * productDetails.selling_price,
                                                        selling_price: productDetails.selling_price,
                                                        quantity: key.quantity,
                                                        description: key.description,
                                                        gst_percentage: key.gstPercentage,
                                                        taxable_price: (key.gstPercentage / 100) * (key.quantity * productDetails.selling_price)
                                                    }
                                                    await InvoiceItems.update(updateItem, { where: { inv_id: invoiceId, inv_uni_id: invoiceUniId, product_id: key.productId } }).then(async updateInvItem => {
                                                        console.log('Update Invoice Item Details', updateInvItem)
                                                    }).catch(updateInvItemError => {
                                                        console.log('Update Invoice Item Error', updateInvItemError)
                                                    })
                                                }
                                                else {
                                                    let insertItem = {
                                                        inv_id: invoiceId,
                                                        inv_uni_id: invoiceUniId,
                                                        product_id: key.productId,
                                                        selling_price: productDetails.selling_price,
                                                        quantity: key.quantity,
                                                        description: key.description,
                                                        subtotal_price: key.quantity * productDetails.selling_price,
                                                        gst_percentage: key.gstPercentage,
                                                        taxable_price: (key.gstPercentage / 100) * (key.quantity * productDetails.selling_price)
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
        if (req.query.inv_uni_id == '' && req.query.userId == '') {
            customResponse(res, 1, 'Please provide Invoice & User Id.');
        }
        else {
            await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                if (!userDetails) {
                    customResponse(res, 1, "User Not Found in Our System.")
                }
                else {
                    const invoiceDetails = await Invoice.findOne({ where: { inv_uni_id: req.query.inv_uni_id, user_id: req.query.userId, is_deleted: 0 } });
                    if (invoiceDetails) {
                        const finalInvoiceDetails = await getInvoiceResponseData(invoiceDetails)
                        success(res, 200, 'Invoice Details', finalInvoiceDetails)
                    }
                    else {
                        customResponse(res, 1, 'Invoice not found with this id in our system.');
                    }
                }
            }).catch(userDetaislError => {
                customResponse(res, 1, "User not found in our system.")
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
            if (req.query.inv_uni_id == '' && req.query.userId == '') {
                customResponse(res, 1, 'Please provide Invoice & User Id.');
            }
            else {
                await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                    if (!userDetails) {
                        customResponse(res, 1, "User Not Found in Our System.")
                    }
                    else {
                        Invoice.findOne({ where: { inv_uni_id: req.query.inv_uni_id, user_id: req.query.userId } }).then((data) => {
                            if (data) {
                                let updateInvoice = { is_deleted: 1 };
                                Invoice.update(updateInvoice, { where: { inv_uni_id: req.query.inv_uni_id } }).then(invoicedata => {
                                    success(res, 200, "Invoice deleted Successfuly.");
                                }).catch(err => {
                                    error(res, 500, err);
                                })
                            }
                            else {
                                error(res, 404, "Invoice not exists with this id");
                            }
                        }).catch(invoiceFindError => {
                            customResponse(res, 1, invoiceFindError)
                        })
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

function number2text(value) {
    var fraction = Math.round(frac(value) * 100);
    var f_text = "";

    if (fraction > 0) {
        f_text = "AND " + convert_number(fraction) + " PAISE";
    }

    return convert_number(value) + " RUPEE " + f_text + " ONLY";
}

function frac(f) {
    return f % 1;
}

function convert_number(number) {
    if ((number < 0) || (number > 999999999)) {
        return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
        res += (convert_number(Gn) + " CRORE");
    }
    if (kn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(kn) + " LAKH");
    }
    if (Hn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(Hn) + " THOUSAND");
    }

    if (Dn) {
        res += (((res == "") ? "" : " ") +
            convert_number(Dn) + " HUNDRED");
    }


    var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN");
    var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY");

    if (tn > 0 || one > 0) {
        if (!(res == "")) {
            res += " AND ";
        }
        if (tn < 2) {
            res += ones[tn * 10 + one];
        }
        else {

            res += tens[tn];
            if (one > 0) {
                res += ("-" + ones[one]);
            }
        }
    }

    if (res == "") {
        res = "zero";
    }
    return res;
}
console.log(convert_number(245200))
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
console.log(titleCase("I'm a little tea pot"));

// decode html entities
function decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];
    for (var i = 0, max = entities.length; i < max; ++i)
        text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
    return text;
}
const formatter = () => {
    let n = 0;
    const increment = () => {
        return ++n;
    }

    console.log(increment()) // 1
    console.log(increment()) // 2
    console.log(increment()) // 3
    console.log(increment()) // 4
}

//invoice gen
exports.InvoiceGenerate = [async (req, res) => {

    if (req.query.inv_uni_id == "") {
        customResponse(res, 1, "Please Provide Invoice Id.")
    }
    else {
        await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
            if (!userDetails) {
                customResponse(res, 1, "User Not Found in Our System.")
            }
            else {
                const invoiceDetails = await Invoice.findOne({ where: { inv_uni_id: req.query.inv_uni_id, user_id: req.query.userId } });
                // console.log("invoiceDetails",invoiceDetails);
                if (invoiceDetails) {
                    const invoiceItemsDetails = await InvoiceItems.findAll({ where: { inv_uni_id: req.query.inv_uni_id, quantity: { [Op.gt]: 0 } } });
                    const customerDetails = await queryHelper.getCustomerDetailsByInvoiceId(req.query.inv_uni_id);
                    const invoiceTotalAmount = await queryHelper.getSumofSellingPriceByInvoiceId(req.query.inv_uni_id);
                    const invoiceTotalTaxAmount = await queryHelper.getSumofTaxablePriceByInvoiceId(req.query.inv_uni_id);
                    const userDetails = await queryHelper.getUserDetailsByUserId(req.query.inv_uni_id);
                    const customerAddressDetails = await queryHelper.getAddressDetailsByInvoiceId(req.query.inv_uni_id);
                    const neftDetails = await queryHelper.getNeftDetailsByUserId(req.query.userId)
                    const upiDetails = await queryHelper.getUserUpiDetailsByUserId(req.query.userId)
                    // console.log("upiDetails", upiDetails);

                    var finalItemDetails = []
                    var finalNeftDetails = []
                    var invoiceGstAmounts = 0
                    var invoicetotalAmountss = 0
                    if (invoiceDetails.gst_type == 'igst') {
                        let gstAmount = invoiceTotalAmount
                        invoiceGstAmounts = parseInt(gstAmount)

                        let totalAmount = parseInt(invoiceTotalAmount, 10) + parseInt(invoiceTotalTaxAmount, 10)
                        invoicetotalAmountss = parseInt(totalAmount, 10)
                    }
                    else if (invoiceDetails.gst_type == 'cgst' || 'sgst') {
                        let gstAmount = invoiceTotalAmount
                        invoiceGstAmounts = parseInt(gstAmount, 10)

                        let totalAmount = parseInt(invoiceTotalAmount, 10) + parseInt(invoiceTotalTaxAmount, 10)
                        invoicetotalAmountss = parseInt(totalAmount, 10)
                    }

                    else {
                        let gstAmount = 0
                        invoiceGstAmounts = parseInt(gstAmount)

                        let totalAmount = parseInt(invoiceTotalAmount, 10) + parseInt(invoiceTotalTaxAmount, 10)
                        invoicetotalAmountss = parseInt(totalAmount, 10)
                    }
                    const numWords = convert_number(invoicetotalAmountss)

                    moment().format(moment.HTML5_FMT.DATE);
                    // console.log(moment("2019-11-08T17:44:56.144").format(moment.HTML5_FMT.DATE));

                    let finalInvoiceDetails = {
                        //invoiceId: invoiceDetails.inv_id,
                        invoiceId: invoiceDetails.inv_id,
                        customerName: customerDetails.salutation + ' ' + customerDetails.first_name + ' ' + customerDetails.last_name,
                        buyerCompanyName: customerDetails.company_name,
                        companyGSTIN: customerDetails.gstin,
                        // customerPAN: customerDetails.pan,
                        state: customerAddressDetails.state,
                        city: customerAddressDetails.city,
                        customerEmail: customerDetails.email,
                        customerAddress: customerAddressDetails.address,
                        customerWorkPhone: customerDetails.work_phone,
                        customerMobile: customerDetails.mobile,
                        invoiceDate: invoiceDetails.inv_date,
                        invoiceDueDate: invoiceDetails.due_date,
                        invoiceTotal: parseInt(invoiceTotalAmount, 10),
                        invoiceGstType: invoiceDetails.gst_type,
                        //invoiceGst: (invoiceDetails.gst_type == 'tds') ? 20 : ((invoiceDetails.gst_type == 'tcs') ? 10 : 0),
                        invoiceGstAmount: invoiceGstAmounts,
                        invoiceTotalAmounts: invoicetotalAmountss,
                        totalAmountInWords: titleCase(numWords),
                        invoiceFooter: invoiceDetails.footer,
                        // invoiceTerms: termsDetails.terms_label,
                        invoiceQrCode: invoiceDetails.e_inv_qr_code,
                        paymentQrCode: userDetails.payment_qr_code,
                        invoiceLogo: userDetails.profile_pic,
                        purchaseOrderNum: invoiceDetails.order_number,
                        purchaseOrderDate: moment(invoiceDetails.purchase_order).format(moment.HTML5_FMT.DATE),
                        telNo: userDetails.contact_number,
                        clientGSTIN: userDetails.gst_in,
                        beneficiaryName: userDetails.trade_name,
                        regdOffice: userDetails.address,
                        userWebsite: userDetails.website,
                        terms: (userDetails.terms)?decodeHTMLEntities(userDetails.terms):'',
                        companyName: userDetails.trade_name,
                        userEmail: userDetails.email,
                        igstSum: invoiceTotalTaxAmount,
                        SlNo: formatter(),
                        // upiId: upiDetails.upi_id,
                        // upiNumber: upiDetails.upi_number,
                        // upiTtype: upiDetails.upi_type,
                        // cgstSum: cgstSum
                        // invoiceQrCode: invoiceDetails.qr_code,      // will use later
                    }


                    for (const itemDetails of invoiceItemsDetails) {
                        // console.log("itemDetails", itemDetails);
                        let item = {
                            itemName: await queryHelper.getProductNameById(itemDetails.product_id),
                            // itemDescription: await queryHelper.getProductDescriptionById(itemDetails.product_id),
                            itemDescription: (itemDetails.description)?itemDetails.description:'',
                            itemPrice: itemDetails.selling_price,
                            itemQuantity: itemDetails.quantity,
                            itemGstPercentage: itemDetails.gst_percentage,
                            itemSubtotal: itemDetails.subtotal_price,
                            taxSubtotal: itemDetails.taxable_price,
                            hsnSac: await queryHelper.getProductHsnById(itemDetails.product_id),
                            type: await queryHelper.getProductTypeById(itemDetails.product_id),


                        }
                        // console.log("itemss", item);

                        finalItemDetails.push(item)
                    }


                    finalInvoiceDetails.itemDetails = finalItemDetails

                    finalInvoiceDetails.neftDetail = neftDetails
                    finalInvoiceDetails.upiDetail = upiDetails
                    finalInvoiceDetails.taxArray = invoiceItemsDetails
                    // finalInvoiceDetails.getTaxablePriceDetail = getTaxablePriceData
                    //finalInvoiceDetails.neftDetail = neftDetails
                    // console.log('finalInvoiceDetails', finalInvoiceDetails)

                   

                    const invoicePdfData = await updatePdf(finalInvoiceDetails);
                    // const browser = await puppeteer.launch();
                    let invId = invoiceDetails.inv_id
                    //const invoiceName = req.query.inv_id + '-' + uuidv4() + '-invoice.pdf'
                    const  invoiceName  = invId.replace(/\//g, "_")+'_invoice.pdf'
                    const invoicePath = path.join(process.cwd(), 'public/invoices', invoiceName)
                    let options = { format: 'A4',  "height": "11.7in",
                    "width": "8.3in",  path: invoicePath };
                        // await browser.close();
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

// upload qr code
exports.uploadQrCode = [
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg, errors.array());
            }
            await uploadFile(req, res);
            Invoice.findOne({ where: { inv_uni_id: req.body.invId } }).then(invDetail => {
                if (invDetail) {
                    var qrDetails = {}
                    let payment_qr_code = req.file ? req.file.originalname : '';

                    if (payment_qr_code != '') {
                        qrDetails.payment_qr_code = payment_qr_code
                    }

                    Invoice.update(qrDetails, { where: { inv_uni_id: req.body.invId } }).then(async updated => {
                        const qrData = await Invoice.findOne({ where: { inv_uni_id: req.body.invId } });
                        if (qrData) {
                            const finalDetails = await getInvoiceResponseData(qrData)
                            success(res, 200, 'payment qrCode Updated successfully', finalDetails)
                        }
                        else {
                            customResponse(res, 1, 'No inv id Found with this id in our system.')
                        }
                    }).catch(err => {
                        customResponse(res, 1, err);
                    });
                }
                else {
                    customResponse(res, 1, "Inv Id not found")
                }
            }).catch(invFindError => {
                customResponse(res, 1, invFindError)
            })

        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]

// upload E Inv qr code
exports.uploadEInvQrCode = [
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg, errors.array());
            }
            await uploadFile(req, res);
            Invoice.findOne({ where: { inv_uni_id: req.body.invId } }).then(invDetail => {
                if (invDetail) {
                    var qrDetail = {}
                    let e_inv_qr_code = req.file ? req.file.originalname : '';

                    if (e_inv_qr_code != '') {
                        qrDetail.e_inv_qr_code = e_inv_qr_code
                    }
                    Invoice.update(qrDetail, { where: { inv_uni_id: req.body.invId } }).then(async updated => {
                        const qrData = await Invoice.findOne({ where: { inv_uni_id: req.body.invId } });
                        if (qrData) {
                            const finalDetails = await getInvoiceResponseData(qrData)
                            success(res, 200, 'E Inv qrCode Updated successfully', finalDetails)
                        }
                        else {
                            customResponse(res, 1, 'No inv id Found with this id in our system.')
                        }
                    }).catch(err => {
                        customResponse(res, 1, err);
                    });
                }
                else {
                    customResponse(res, 1, "Inv Id not found")
                }
            }).catch(invFindError => {
                customResponse(res, 1, invFindError)
            })

        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]
// upload logo
exports.uploadLogo = [
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg, errors.array());
            }
            await uploadFile(req, res);
            Invoice.findOne({ where: { inv_uni_id: req.body.invId } }).then(invDetail => {
                if (invDetail) {
                    var logoDetails = {}
                    let inv_logo = req.file ? req.file.originalname : '';

                    if (inv_logo != '') {
                        logoDetails.inv_logo = inv_logo
                    }
                    Invoice.update(logoDetails, { where: { inv_uni_id: req.body.invId } }).then(async updated => {
                        const logoData = await Invoice.findOne({ where: { inv_uni_id: req.body.invId } });
                        if (logoData) {
                            const finalDetails = await getInvoiceResponseData(logoData)
                            success(res, 200, 'logo Data Updated successfully', finalDetails)
                        }
                        else {
                            customResponse(res, 1, 'No inv id Found with this id in our system.')
                        }
                    }).catch(err => {
                        customResponse(res, 1, err);
                    });
                }
                else {
                    customResponse(res, 1, "Inv Id not found")
                }
            }).catch(invFindError => {
                customResponse(res, 1, invFindError)
            })

        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]

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

//Account details
exports.userAccount = [async (req, res) => {
    if (req.query.user_id == "") {
        customResponse(res, 1, "Please Provide user Id.")
    }
    else {
        const AccountDetailsList = await UserAccounts.findAll({ where: { user_id: req.query.userId, status: 0 } });
        var accountData = [];
        if (AccountDetailsList.length > 0) {

            for (const AccountDetails of AccountDetailsList) {
                accountDataa = {
                    id: AccountDetails.id ? AccountDetails.id : '',
                    user_id: AccountDetails.user_id ? AccountDetails.user_id : '',
                    bank_name: AccountDetails.bank_name ? AccountDetails.bank_name : '',
                    ifsc_code: AccountDetails.ifsc_code ? AccountDetails.ifsc_code : '',
                    account_number: AccountDetails.account_number ? AccountDetails.account_number : '',
                    account_holder: AccountDetails.account_holder ? AccountDetails.account_holder : '',
                    account_email: AccountDetails.account_email ? AccountDetails.account_email : '',
                    address: AccountDetails.address ? AccountDetails.address : '',
                }
                accountData.push(accountDataa);
            }
            success(res, 200, "Account Details.", accountData)
        }
        else {
            success(res, 200, "Account Details.", accountData)
        }
    }
}];

//add & update Account
exports.addAccouns = [
    body("user_id").isLength({ min: 1 }).trim().withMessage("User Id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            else {
                if (req.body.bankDetails) {
                    for (const AccountDetails of req.body.bankDetails) {
                        if (AccountDetails.id) {
                            //Update
                            const account = {
                                user_id: req.body.user_id ? req.body.user_id : '',
                                bank_name: AccountDetails.bank_name ? AccountDetails.bank_name : '',
                                ifsc_code: AccountDetails.ifsc_code ? AccountDetails.ifsc_code : '',
                                account_number: AccountDetails.account_number ? AccountDetails.account_number : '',
                                account_holder: AccountDetails.account_holder ? AccountDetails.account_holder : '',
                                account_email: AccountDetails.account_email ? AccountDetails.account_email : '',
                                address: AccountDetails.address ? AccountDetails.address : ''
                            }

                            UserAccounts.update(account, { where: { id: AccountDetails.id } }).then(async updateInv => {
                                success(res, 200, "Account updated Successfuly.");
                            }).catch(err => {
                                error(res, 500, err);
                            })

                        }
                        else {
                            //Insert
                            const account = {
                                user_id: req.body.user_id ? req.body.user_id : '',
                                bank_name: AccountDetails.bank_name ? AccountDetails.bank_name : '',
                                ifsc_code: AccountDetails.ifsc_code ? AccountDetails.ifsc_code : '',
                                account_number: AccountDetails.account_number ? AccountDetails.account_number : '',
                                account_holder: AccountDetails.account_holder ? AccountDetails.account_holder : '',
                                account_email: AccountDetails.account_email ? AccountDetails.account_email : '',
                                address: AccountDetails.address ? AccountDetails.address : ''
                            }
                            await UserAccounts.create(account).then(async customerSaveDetails => {
                                success(res, 200, "Account added Successfuly.");
                            }).catch(err => {
                                error(res, 500, err);
                            })

                        }
                    }
                }

            }

        }
        catch (err) {
            customResponse(res, 1, err);
        }
    }
];

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