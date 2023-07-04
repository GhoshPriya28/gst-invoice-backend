require('dotenv').config();
const { User } = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const bcrypt = require("bcrypt");
const sendEmail = require("../../helpers/mailer.js");
var jwt = require('jsonwebtoken');
const { getUsersResponseData } = require("../../helpers/response/parse-response.js");
const { BASE_URL } = process.env;
const { Validator } = require('node-input-validator');

//login
exports.login = [
    body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified."),
    body("password").notEmpty().withMessage("Password must be specified."),
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            User.findOne({ where: { email: req.body.email } }).then(async userDetails => {
                if (userDetails) {
                    bcrypt.compare(req.body.password, userDetails.password, async function (err, result) {
                        if (err) {
                            customResponse(res, 1, err)
                        }
                        if (result) {
                            let token = jwt.sign({ email: req.body.email }, process.env.JWT_TOKEN_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME })
                            const finalUserDetails = await getUsersResponseData(userDetails, token)
                            success(res, 200, 'Login Successful.', finalUserDetails)
                        }
                        else {
                            customResponse(res, 1, "Password doesn't matched.");
                        }
                    })
                }
                else {
                    customResponse(res, 1, "Invalid Email.");
                }
            });
        }
        catch (err) {
            customResponse(res, 1, err);
        }
    }
];
// change password
exports.ChangePassword = [
    body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified."),
    body("oldPassword").notEmpty().withMessage("Old Password must be specified."),
    body("newPassword").notEmpty().withMessage("New Password must be specified."),
    body("confirmPassword").notEmpty().withMessage("Confirm Password must be specified."),
    async (req, res) => {
    try {
        var oldPassword = req.body.oldPassword;
        var newPassword = req.body.newPassword
        var confirmPassword = req.body.confirmPassword
        let user = await User.findOne({ where: { email: req.body.email } })
        if (user != null) {
            var hash = user.password
            const comparePass = bcrypt.compare(oldPassword, hash)
            if (comparePass) {
                //password match
                if (newPassword == confirmPassword) {
                    const hasNewPass = await bcrypt.hash(newPassword, 6)
                    if (hasNewPass) {
                        user.password = hasNewPass;
                        const userSave = await user.save();
                        if (userSave) {
                            success(res, 200, 'Your passwoord has been changed.');
                        }
                    }
                }
                else {
                    error(res, 400, 'new and confirm password does not matched');
                }
            }
        }
    } catch (err) {
        customResponse(res, 1, err);
    }
}
]
//send link for reset pass
exports.SendLinkForReset = [
    body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            const user = await User.findOne({ where: { email: req.body.email } });
            if (!user)
                error(res, 400, "User with given email doesn't exist");
            let randomGen = (Math.random() + 1).toString(36).substring(7);

            let token = await User.findOne({ where: { id: user.id } });
            if (token) {
                token = await User.update({ token: randomGen }, { where: { id: token.id } });
            }
            const link = `${BASE_URL}api/reset-password/${user.id}/${randomGen}`;
            await sendEmail(user.email, "Password reset", link);
            success(res, 200, "Password reset link sent to your email account", user);
        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]
//reset pass
exports.ResetPassword = [
    body('password').notEmpty().withMessage("Password must be specified.").isAlphanumeric().withMessage("Password must be alphaNumeric").isLength({ min: 6, max: 6 }).trim().withMessage("Password must be 6 digits."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg)
            }
            const user = await User.findOne({ where: { id: req.params.id } });
            if (!user) error(res, 400, "Invalid link or expired");

            const token = await User.findOne({ where: { id: user.id, token: req.params.token } });
            if (!token) error(res, 400, "Invalid link or expired");

            user.password = bcrypt.hashSync(req.body.password, 6)
            user.token = 0;
            await user.save();
            success(res, 200, "Password reset sucessfully.", user);
        } catch (err) {
            customResponse(res, 1, err);
        }
    }]

// sahil's code
//update profile
exports.updateProfile = [
    body('email').isLength({ min: 1 }).trim().withMessage("Please provide your email id!"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg, errors.array());
            } else {
                User.findOne({ where: { email: req.body.email } }).then(user => {
                    if (user) {
                        let first_name = req.body.first_name ? req.body.first_name : '';
                        let last_name = req.body.last_name ? req.body.last_name : '';
                        let contact_number = req.body.contact_number ? req.body.contact_number : '';
                        let aadhar_number = req.body.aadhar_number ? req.body.aadhar_number : '';
                        let gst_in = req.body.gst_in ? req.body.gst_in : '';
                        var profileDetails = { first_name, last_name, gst_in, contact_number, aadhar_number };
                        User.update(profileDetails, { where: { email: req.body.email } }).then(async updated => {
                            success(res, 200, 'Profile Updated successfully');
                        }).catch(err => {
                            customResponse(res, 1, err);
                        });
                    }
                    else {
                        customResponse(res, 1, "User not found with this E-mail Id")
                    }
                }).catch(userFindError => {
                    customResponse(res, 1, userFindError)
                })
            }
        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]