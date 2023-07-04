const bcrypt = require("bcryptjs");

//For Register Page
const dashboardView = (req, res) => {
    res.render("admin/pages/dashboard", {
    } );
}

module.exports =  {
    dashboardView
};