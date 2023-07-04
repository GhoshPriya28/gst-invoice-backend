require('dotenv').config();
const { Terms } = require("../../sql-connections/models");
const { success, error, customResponse } = require("../../helpers/response/api-response.js");


exports.getTermsData = [
    async (req, res) => {
        try {
            if (req.query.userId == '') {
                customResponse(res, 1, 'Please provide user id.');
            }
            else {
            //const findTerms = await Terms.findAll({ where: { user_id: req.query.userId } });
            const findTerms = await Terms.findAll();
            if (findTerms) {
                success(res, 200, "Invoice Terms.", findTerms);
            }
        }
        }
        catch (err) {
            customResponse(res, 1, err);
        }
    }
];



