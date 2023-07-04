const { Router } = require('express');
const apiRouter = Router();
const verifyToken = require("../middlewares/auth/jwtAuth.js");
const { success, error, validation } = require("../helpers/response/api-response.js");
const {checkDuplicateEmailOrPhone} = require("../middlewares/validation/verifySignUp.js");
const registerController = require("../controllers/api/RegisterController.js");
const LoginController = require("../controllers/api/LoginController.js");
const InvoiceController = require("../controllers/api/invoiceController.js");
const MasterController = require("../controllers/api/MasterController.js");
const profileController = require('../controllers/api/profileController.js')


// const pdfController = require("../controllers/api/homeController.js")

const ItemsController = require("../controllers/api/itemsController.js");
const CustomerController = require('../controllers/api/customersController');
const upiController = require('../controllers/api/userUpiController.js');


apiRouter.get('/', (req, res, next) => {
  logger.info("Checking the API status: Everything is OK");
  success(res, 200, "Welcome to Books REST API by The JavaScript Dojo")
});

//login routes
apiRouter.post("/register", checkDuplicateEmailOrPhone, registerController.register);

//modified by sahil
//login routes
apiRouter.post("/login",  LoginController.login);
apiRouter.put("/change-password", LoginController.ChangePassword);
apiRouter.post('/reset-password-sendlink', LoginController.SendLinkForReset)
apiRouter.post('/reset-password/:id/:token', LoginController.ResetPassword)

// //items routes
apiRouter.post("/product", verifyToken, ItemsController.addProduct);
apiRouter.put('/product', verifyToken, ItemsController.updateProduct);
apiRouter.get("/product", verifyToken, ItemsController.GetByProductId);
apiRouter.get("/products", verifyToken, ItemsController.getAllProducts);
apiRouter.delete('/product', verifyToken, ItemsController.deleteByProductId);

//invoice routes
apiRouter.post("/addInvoice",InvoiceController.addInvoice);
apiRouter.get("/getby-invoiceid", InvoiceController.GetByInvoiceId);
apiRouter.post("/update-invoice", InvoiceController.updateInvoice);
apiRouter.delete("/delete-invoicebyid", verifyToken, InvoiceController.deleteByInvoiceId);
apiRouter.get("/get-all-invoice", InvoiceController.getAllInvoice);

apiRouter.post('/upload-einvqrcode', InvoiceController.uploadEInvQrCode);
apiRouter.post('/upload-logo', InvoiceController.uploadLogo);

//invoice pdf route
apiRouter.get('/generate-pdf', InvoiceController.InvoiceGenerate);

//profile routes
apiRouter.get('/get-by-id', verifyToken, profileController.GetById);
apiRouter.put('/update-profile', verifyToken, profileController.updateProfile);
apiRouter.post('/upload-qrcode', profileController.uploadQrCode);

//invoice and customer terms
apiRouter.get("/getTerms",  MasterController.getTermsData)

//items routes
apiRouter.post("/product", verifyToken, ItemsController.addProduct);
apiRouter.put('/product', verifyToken, ItemsController.updateProduct);
apiRouter.get("/product", verifyToken, ItemsController.GetByProductId);
apiRouter.get("/products", verifyToken, ItemsController.getAllProducts);
apiRouter.delete('/product', verifyToken, ItemsController.deleteByProductId);
apiRouter.get('/product-list', verifyToken, ItemsController.getAllProductList);

//customers routes
apiRouter.post("/customer", verifyToken, CustomerController.addCustomer);
apiRouter.put('/customer', verifyToken, CustomerController.updateCustomer);
apiRouter.get('/customers', verifyToken, CustomerController.getAllCustomers);
apiRouter.get('/customer', verifyToken, CustomerController.GetByCustomerId);
apiRouter.delete('/customer', verifyToken, CustomerController.deleteByCustomerId);

apiRouter.get('/customers-contact', verifyToken, CustomerController.getAllCustomersContact);

//address routes
apiRouter.get('/address', verifyToken, CustomerController.GetByAddressId);
apiRouter.get('/addresses', verifyToken, CustomerController.getAllAddress);
apiRouter.delete('/address', verifyToken, CustomerController.deleteByAddressId);


apiRouter.get('/taxList', InvoiceController.taxList);
apiRouter.get('/userAccount', InvoiceController.userAccount);
apiRouter.post('/addAccouns', InvoiceController.addAccouns);
apiRouter.delete('/delete-account', InvoiceController.deleteAccounts);

//UPI
apiRouter.post('/add-upi',upiController.addUpi);
apiRouter.get('/upi-list', upiController.getAllUpi);
apiRouter.delete('/delete-upi', upiController.deleteUpi);


apiRouter.all('*', (req, res, next) =>
  error(res, 404, "Route Un-available")
);

module.exports = apiRouter;