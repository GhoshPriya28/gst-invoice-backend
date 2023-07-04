
const pdfTemplate = require('../../../documents/index.js');
const pdf = require('html-pdf');


exports.handleCreateInvoice = async (req, res, next) => {
        pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
            if(err) {
                res.send(Promise.reject());
            }
    
            res.send(Promise.resolve());
        });
}

exports.fetchPdf = (req, res) => {
    res.sendFile(`${__dirname}/result.pdf`)
}