const { User } = require('../../sql-connections/models');
const { body, validationResult } = require("express-validator");
const { success, error, customResponse, validation } = require("../../helpers/response/api-response.js");
const { getUsersResponseData } = require('../../helpers/response/parse-response');
const uploadFile = require("../../middlewares/uploads/uploads.js")

// get by ID
exports.GetById = async (req, res) => {
    try {
        if (req.query.userId == '') {
            customResponse(res, 1, 'Please provide user id.');
        }
        else {
            const profile = await User.findOne({ where: { user_id: req.query.userId } });
            if (profile) {
                const finalUserDetails = await getUsersResponseData(profile)
                success(res, 200, 'Data Found', finalUserDetails)
            }
            else {
                customResponse(res, 1, 'No User Found with this user id in our system.')
            }
        }
    } catch (err) {
        customResponse(res, 1, err.message)
    }
}
// update profile
exports.updateProfile = [
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg, errors.array());
            }
            await uploadFile(req, res);
            User.findOne({ where: { user_id: req.body.userId } }).then(user => {
                console.log(user);
                if (user) {
                    var profileDetails = {}
                    let first_name = req.body.first_name ? req.body.first_name : '';
                    let last_name = req.body.last_name ? req.body.last_name : '';
                    let contact_number = req.body.contact_number ? req.body.contact_number : '';
                    let aadhar_number = req.body.aadhar_number ? req.body.aadhar_number : '';
                    let pan_card = req.body.pan_card ? req.body.pan_card : '';
                    let gst_in = req.body.gst_in ? req.body.gst_in : '';
                    let profile_pic = req.file ? req.file.originalname : '';
                    let address = req.body.address ? req.body.address : '';
                    let website = req.body.website ? req.body.website : '';
                    let trade_name = req.body.trade_name ? req.body.trade_name : '';
                    let terms = req.body.terms ? req.body.terms : '';

                    if (first_name != '') {
                        profileDetails.first_name = first_name
                    }
                    if (last_name != '') {
                        profileDetails.last_name = last_name
                    }
                    if (contact_number != '') {
                        profileDetails.contact_number = contact_number
                    }
                    if (aadhar_number != '') {
                        profileDetails.aadhar_number = aadhar_number
                    }
                    if (pan_card != '') {
                        profileDetails.pan_card = pan_card
                    }
                    if (profile_pic != '') {
                        profileDetails.profile_pic = profile_pic
                    }
                    if (gst_in != '') {
                        profileDetails.gst_in = gst_in
                    }
                    if (address != '') {
                        profileDetails.address = address
                    }
                    if (trade_name != '') {
                        profileDetails.trade_name = trade_name
                    }
                    if (website != '') {
                        profileDetails.website = website
                    }
                    if (terms != '') {
                        profileDetails.terms = terms
                    }
                    User.update(profileDetails, { where: { user_id: req.body.userId } }).then(async updated => {
                        const profile = await User.findOne({ where: { user_id: req.body.userId } });
                        if (profile) {
                            const finalUserDetails = await getUsersResponseData(profile)
                            success(res, 200, 'Profile Updated successfully', finalUserDetails)
                        }
                        else {
                            customResponse(res, 1, 'No User Found with this user id in our system.')
                        }
                    }).catch(err => {
                        customResponse(res, 1, err);
                    });
                }
                else {
                    customResponse(res, 1, "User not found")
                }
            }).catch(userFindError => {
                customResponse(res, 1, userFindError)
            })

        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]

// upload qr code
exports.uploadQrCode = [
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg, errors.array());
            }
            await uploadFile(req, res);
            User.findOne({ where: { user_id: req.body.userId } }).then(invDetail => {
                if (invDetail) {
                    var qrDetails = {}
                    let payment_qr_code = req.file ? req.file.originalname : '';

                    if (payment_qr_code != '') {
                        qrDetails.payment_qr_code = payment_qr_code
                    }
                   
                    User.update(qrDetails, { where: { user_id: req.body.userId } }).then(async updated => {
                        const qrData = await User.findOne({ where: { user_id: req.body.userId } });
                        if (qrData) {
                            const finalDetails = await getUsersResponseData(qrData)
                            success(res, 200, 'payment qrCode Updated successfully', finalDetails)
                        }
                        else {
                            customResponse(res, 1, 'No user id Found with this id in our system.')
                        }
                    }).catch(err => {
                        customResponse(res, 1, err);
                    });
                }
                else {
                    customResponse(res, 1, "user Id not found")
                }
            }).catch(userFindError => {
                customResponse(res, 1, userFindError)
            })

        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]