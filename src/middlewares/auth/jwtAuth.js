const jwt = require('jsonwebtoken')
const config = process.env;
require("dotenv").config();
const { success, error, validation } = require("../../helpers/response/api-response.js");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) error(res, 403, "Token is required for authentication.")
  jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user) => {
    if (err) error(res,401,"You need to be logged in to access this resource.")
    req.user = user
    next()
  })
};
module.exports = verifyToken;
