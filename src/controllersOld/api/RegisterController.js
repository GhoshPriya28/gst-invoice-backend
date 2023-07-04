require('dotenv').config();
const { User } = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { getUsersResponseData } = require("../../helpers/response/parse-response.js");
const bcrypt = require("bcrypt");


// signup
// exports.register = [
//   body("first_name").isLength({ min: 1 }).trim().withMessage("First Name must be specified.").isAlpha('es-ES', { ignore: ' ' }).withMessage("First Name must be alphabetic"),
//   body("last_name").isLength({ min: 1 }).trim().withMessage("Last Name must be specified.").isAlpha('es-ES', { ignore: ' ' }).withMessage("Last Name must be alphabetic"),
//   body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.").isEmail().withMessage("Email must be a valid email address."),
//   body('password').notEmpty().withMessage("Password must be specified.").isAlphanumeric().withMessage("Password must be alphaNumeric").isLength({ min: 6, max: 6 }).trim().withMessage("Password must be 6 digits."),

//   (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         customResponse(res, 1, errors.array()[0].msg)
//       }
//       bcrypt.hash(req.body.password, 6, function (err, hashedPass) {
//         if (err) {
//           customResponse(res, 1, err)
//         }
//         const userData = { first_name: req.body.first_name, last_name: req.body.last_name, password: hashedPass, email: req.body.email }
//         User.create(userData).then(async result => {
//           const finalUserDetails = await getUsersResponseData(result)
//           success(res, 200, 'User Register Successfully.', finalUserDetails)
//         }).catch(userSaveError => {
//           customResponse(res, 1, userSaveError)
//         })
//       })
//     }
//     catch (err) {
//       customResponse(res, 1, err);
//     }
//   }
// ];

//modified by sahil
// signup
exports.register = [
  body("first_name").isLength({ min: 1 }).trim().withMessage("First Name must be specified.").isAlpha('es-ES', { ignore: ' ' }).withMessage("First Name must be alphabetic"),
  body("last_name").isLength({ min: 1 }).trim().withMessage("Last Name must be specified.").isAlpha('es-ES', { ignore: ' ' }).withMessage("Last Name must be alphabetic"),
  body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.").isEmail().withMessage("Email must be a valid email address."),
  body('password').notEmpty().withMessage("Password must be specified.").isAlphanumeric().withMessage("Password must be alphaNumeric").isLength({ min: 6, max: 6 }).trim().withMessage("Password must be 6 digits."),
  body('contact_number').notEmpty().withMessage("Contact number must be specified."),
  body('aadhar_number').notEmpty().withMessage("Aadhar number must be specified."),
  body('pan_card').notEmpty().withMessage("Pan Card must be specified."),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        customResponse(res, 1, errors.array()[0].msg)
      }
      bcrypt.hash(req.body.password, 6, function (err, hashedPass) {
        if (err) {
          customResponse(res, 1, err)
        }
        const userData = {
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
          const finalUserDetails = await getUsersResponseData(result)
          success(res, 200, 'User Register Successfully.', finalUserDetails)
        }).catch(userSaveError => {
          customResponse(res, 1, userSaveError)
        })
      })
    }
    catch (err) {
      customResponse(res, 1, err);
    }
  }
];