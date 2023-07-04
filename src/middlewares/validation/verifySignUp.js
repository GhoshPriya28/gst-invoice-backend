const { User } = require("../../sql-connections/models");
const { success, error, customResponse } = require("../../helpers/response/api-response.js");


checkDuplicateEmailOrPhone = (req, res, next) => {
  // Email
  User.findOne({
    where: {
      email: req.body.email,
    }
  }).then(user => {
    if (user) {
      customResponse(res,1,"Failed! Email is already in use!")
      return;
    }
    next();
  });
};



module.exports = {
  checkDuplicateEmailOrPhone: checkDuplicateEmailOrPhone
};
