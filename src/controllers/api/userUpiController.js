const { User, Upi } = require('../../sql-connections/models');
const { body, validationResult } = require("express-validator");
const { success, error, customResponse, validation } = require("../../helpers/response/api-response.js");
const { getAllUpiResponseData } = require('../../helpers/response/parse-response');
const { v4: uuidv4 } = require('uuid');
const uploadFile = require("../../middlewares/uploads/uploads.js");


// get all 
exports.getAllUpi = async (req, res) => {
    try {
        let pagingLimit = 10;
        let numberOfRows, numberOfPages;
        let numberPerPage = parseInt(pagingLimit, 10) || 1;
        let pageNum = parseInt(req.query.pageNum, 10) || 1;
        let pagingOffset = (pageNum - 1) * numberPerPage;
        var offset = pagingLimit * ((parseInt(req.query.pageNum, 10) - 1));
        var finalUpiList = []
        var finalDetails = {}
        if (req.query.userId == '') {
            customResponse(res, 1, 'Please provide User Id.');
        }
        else {
            Upi.findAndCountAll({ where: { user_id:req.query.userId, status:0 }, offset: pagingOffset, limit: pagingLimit, order: [['id', 'DESC']] }).then(async upiList => {
                numberOfRows = upiList.count
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
                allUpiList = upiList.rows
                for (let i = 0; i < allUpiList.length; i++) {
                    const finalUpiDetails = await getAllUpiResponseData(allUpiList[i])
                    finalUpiList.push(finalUpiDetails)
                }
                finalDetails.pagination = pagination
                finalDetails.upiList = finalUpiList
                success(res, 200, 'Upi List', finalDetails)
            }).catch(upiListError => {
                customResponse(res, 1, upiListError)
            })
        }
    }
    catch (err) {
        customResponse(res, 1, err);
    }
}
//delete by id
exports.deleteUpi = [
    async (req, res) => {
        try {
            if (req.query.user_id == '' && req.query.id == '') {
                customResponse(res, 1, 'Please provide userId, Id.');
            }
            else {
                Upi.findOne({ where: { user_id: req.query.user_id, id: req.query.id, status: 0 } }).then((data) => {
                    if (data) {
                        let updateUpi = { status: 1 };
                        Upi.update(updateUpi, { where: { user_id: req.query.user_id, id: req.query.id } }).then(upiData => {
                            success(res, 200, "Upi data deleted Successfuly.");
                        }).catch(err => {
                            error(res, 500, err);
                        })
                    }
                    else {
                        error(res, 404, "Upi data not exists with this id");
                    }
                })
            }
        } catch (err) {
            error(res, 500, err);
        }
    }
]

//add & Update Upi
exports.addUpi = [
    body("user_id").isLength({ min: 1 }).trim().withMessage("User Id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            else {
                await User.findOne({ where: { user_id: req.body.user_id } }).then(async userDetails => {
                    if (userDetails) {
                        if (req.body.upiDetails) {
                            for (const UpiDetails of req.body.upiDetails) {
                                if (UpiDetails.id) {
                                    //Update
                                    const upi = {
                                        user_id: req.body.user_id ? req.body.user_id : '',
                                        upi_id: UpiDetails.upi_id ? UpiDetails.upi_id : '',
                                        upi_number: UpiDetails.upi_number ? UpiDetails.upi_number : '',
                                        upi_type: UpiDetails.upi_type ? UpiDetails.upi_type : '',
                                    }
                                    Upi.update(upi, { where: { id: UpiDetails.id } }).then(async updateInv => {
                                        success(res, 200, "Upi updated Successfuly.");
                                    }).catch(err => {
                                        error(res, 500, err);
                                    })
                                }
                                else {
                                    //Insert
                                    const upi = {
                                        user_id: req.body.user_id ? req.body.user_id : '',
                                        upi_id: UpiDetails.upi_id ? UpiDetails.upi_id : '',
                                        upi_number: UpiDetails.upi_id ? UpiDetails.upi_id : '',
                                        upi_type: UpiDetails.upi_type ? UpiDetails.upi_type : '',
                                    }
                                    await Upi.create(upi).then(async upiSaveDetails => {
                                        success(res, 200, "Upi added Successfuly.");
                                    }).catch(err => {
                                        error(res, 500, err);
                                    })

                                }
                            }
                        }
                    } else {
                        customResponse(res, 1, "Given User Id not exist in our system.")
                    }
                })
            }

        }
        catch (err) {
            customResponse(res, 1, err);
        }
    }
];





