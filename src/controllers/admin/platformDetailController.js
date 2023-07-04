const bcrypt = require("bcryptjs");

//For Register Page
const platformDetailView = (req, res) => {
    res.render("admin/pages/platform-detail", {
    } );
}

module.exports =  {
    platformDetailView
};