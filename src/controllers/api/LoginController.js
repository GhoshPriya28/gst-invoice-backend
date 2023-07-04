require('dotenv').config();
const { User } = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const bcrypt = require("bcrypt");
const sendEmail = require("../../helpers/mailer.js");
var jwt = require('jsonwebtoken');
const { getUsersResponseData } = require("../../helpers/response/parse-response.js");
const { BASE_URL } = process.env;

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
                console.log("userDetails", userDetails);
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
                    customResponse(res, 1, "This email id not registered with us.");
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
    body('oldPassword').notEmpty().withMessage("Old Password must be specified.").isLength({ min: 6, max: 15 }).trim().withMessage("A min of 6 characters and a max of 15 characters"),
    body("newPassword").notEmpty().withMessage("New Password must be specified.").isLength({ min: 6, max: 15 }).trim().withMessage("A min of 6 characters and a max of 15 characters"),
    body("confirmPassword").notEmpty().withMessage("Confirm Password must be specified.").isLength({ min: 6, max: 15 }).trim().withMessage("A min of 6 characters and a max of 15 characters"),
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            customResponse(res, 1, errors.array()[0].msg)
        }
        else
        {

            var oldPassword = req.body.oldPassword;
            var newPassword = req.body.newPassword
            var confirmPassword = req.body.confirmPassword
            let user = await User.findOne({ where: { email: req.body.email } })
            if (user != null) {
                bcrypt.compare(oldPassword, user.password, async function (err, result) {
                    if (err)
                    {
                        customResponse(res, 1, err)
                    }
                    else
                    {
                        if(result === false)
                        {
                            customResponse(res, 1, "Old Password does not matched.")
                        }
                        else
                        {
                            if (newPassword == confirmPassword) {
                                const hasNewPass = await bcrypt.hash(newPassword, 6)
                                if (hasNewPass) {
                                    user.password = hasNewPass;
                                    const userSave = await user.save();
                                    if (userSave) {
                                        success(res, 200, 'Your password has been changed.');
                                    }
                                }
                            }
                            else
                            {
                                customResponse(res, 1, 'New and confirm password does not matched');
                            }
                        }
                    }
                })
            }
            else
            {
                customResponse(res,1,'User Not Found in Our System.')
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
            // const link = `${req.body.linkUrl}/reset-password/${user.id}/${randomGen}`;
            const link = `http://www.tychotechnologies.com/gstsahayak/reset-password/${user.id}/${randomGen}`;
            console.log("link", link);
            await sendEmail(user.email, "Password reset", link);
            success(res, 200, "Password reset link sent to your email account", user);
        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]
//reset pass
exports.ResetPassword = [
    body('password').notEmpty().withMessage("Password must be specified.").isLength({ min: 6, max: 15 }).trim().withMessage("A min of 6 characters and a max of 15 characters"),
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