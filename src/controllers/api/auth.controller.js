require('dotenv').config();
const { User,EmailTemplate } = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const utility = require("../../helpers/utility/utility.js");
const bcrypt = require("bcrypt");
const mailer = require("../../helpers/mailer.js");
const { BASE_URL,} = process.env;


// signup
exports.register = [
  body("first_name").isLength({ min: 1 }).trim().withMessage("First Name must be specified."),
  body("last_name").isLength({ min: 1 }).trim().withMessage("Last Name must be specified."),
  body("password").trim(),
  body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.").isEmail().withMessage("Email must be a valid email address.").custom((value) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject("User Already Exists");
        }
      });
    }),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        customResponse(res, 1, errors.array()[0].msg)
      }

      if (!req.body.password) {
        var generatedPassword = utility.generatePassword();
      }
      else {
        var generatedPassword = req.body.password;
      }

      bcrypt.hash(generatedPassword, 10, function (err, hash) {
        var user = new User(
          {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash,
          }
        );
        console.log(user);
        if (!req.body.password) {
          EmailTemplate.findOne({ where: { id: '4' } }).then((tamplate) => {
            var tamplate = tamplate.content;
            var link = `${BASE_URL}reset-password?username=${req.body.email}&password=${generatedPassword}`;
            tamplate = tamplate.replace('title', "Please Confirm Your Account");
            tamplate = tamplate.replace('Username', req.body.first_name + ' ' + req.body.last_name);
            tamplate = tamplate.replace('Firstcontent', "Please confirm your account by copying the password below and entering this into Recon-3D. You will then be prompted to create a new password.<br><br>Password: " + generatedPassword + " <br><br> Click <a href=" + link + ">here</a> to go back to Recon-3D");

            user.save(function (err) {
              if (err) { customResponse(res, 1, err); }
            }).then(function () {
              mailer.send(
                constants.confirmEmails.from,
                req.body.email,
                "Account Creation on Invoice",
                tamplate
              ).then(function () {
                var userData = userResponseUtility.getUserResponse(user);
                success(res, 200, "User created successfully.", userData);
              }).catch(err => {
                customResponse(res, 1, err);
              });
              var userData = userResponseUtility.getUserResponse(user);
              success(res, 200, "User created successfully.", userData);
            });

          })
        }
        else {
          EmailTemplate.findOne({ where: { id: '4' } }).then((tamplate) => {
            var tamplate = tamplate.content;
            tamplate = tamplate.replace('title', "Account Registered Successfully.");
            tamplate = tamplate.replace('Username', req.body.first_name + ' ' + req.body.last_name);
            tamplate = tamplate.replace('Firstcontent', "Please confirm your account by copying the password below and entering this into Recon-3D.");

            user.save(function (err) {
              if (err) { customResponse(res, 1, err); }
            }).then(function () {
              mailer.send(
                constants.confirmEmails.from,
                req.body.email,
                //"zunedgkp@gmail.com",
                "Welcome to Invoice",
                tamplate
              ).then(function () {
                var userData = userResponseUtility.getUserResponse(user);
                success(res, 200, "User created successfully.", userData);
              }).catch(err => {
                customResponse(res, 1, err);
              });
              var userData = userResponseUtility.getUserResponse(user);
              success(res, 200, "User created successfully.", userData);
            });

          })
        }
      });
    }
    catch (err) {
      customResponse(res, 1, err);
    }
  }
];