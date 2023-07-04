const bcrypt = require("bcryptjs");

// For View 
const loginView = (req, res) => {

    res.render("admin/pages/index", {});
}
module.exports =  {
    loginView
};