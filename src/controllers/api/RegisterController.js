require('dotenv').config();
const { User } = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { getUsersResponseData } = require("../../helpers/response/parse-response.js");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// signup
exports.register = [
  body("first_name").isLength({ min: 1 }).trim().withMessage("First Name must be specified.").isAlpha('es-ES', { ignore: ' ' }).withMessage("First Name must be alphabetic"),
  body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.").isEmail().withMessage("Email must be a valid email address."),
  body('password').notEmpty().withMessage("Password must be specified.").isLength({ min: 6, max: 15 }).trim().withMessage("A min of 6 characters and a max of 15 characters"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        customResponse(res, 1, errors.array()[0].msg)
      }
      else {
        const userId = uuidv4()
        bcrypt.hash(req.body.password, 6, function (err, hashedPass) {
          if (err) {
            customResponse(res, 1, err)
          }
          const userData = {
            user_id: userId,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email, 
            contact_number: req.body.contact_number,
            password: hashedPass,
            ref_password: req.body.password,
            aadhar_number: req.body.aadhar_number,
            pan_card: req.body.pan_card,
            gst_in: req.body.gst_in
          }
          User.create(userData).then(async result => {
            const userDetails = await User.findOne({ where: {id: result.id}});
            console.log("userDetails", userDetails);
            const token = jwt.sign({user_id: userDetails.user_id}, process.env.JWT_TOKEN_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME });
            const finalUserDetails = await getUsersResponseData(userDetails,token)
            success(res, 200, 'User Register Successfully.', finalUserDetails)
          }).catch(userSaveError => {
            customResponse(res, 1, userSaveError)
          })
        })
      }
    }
    catch (err) {
      console.log('Catch Block Error', err)
      customResponse(res, 1, err);
    }
  }
];
