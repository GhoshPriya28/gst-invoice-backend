const { Router } = require('express');
const apiRouter = Router();
const { success, error, validation } = require("../helpers/response/api-response.js");
const {checkDuplicateEmail} = require("../middlewares/validation/verifySignUp.js");

const registerController = require("../controllers/api/RegisterController.js");
const LoginController = require("../controllers/api/LoginController.js");
const InvoiceController = require("../controllers/api/invoiceController.js")

const ItemsController = require("../controllers/api/itemsController.js");
const CustomerController = require('../controllers/api/customersController')


apiRouter.get('/', (req, res, next) => {
  logger.info("Checking the API status: Everything is OK");
  success(res,200,"Welcome to Books REST API by The JavaScript Dojo")
});

//login routes
// apiRouter.post("/register", checkDuplicateEmail, registerController.register);
// apiRouter.post("/login", LoginController.login);
// apiRouter.patch("/change-password", LoginController.ChangePassword);
// apiRouter.post('/reset-password-sendlink', LoginController.SendLinkForReset)
// apiRouter.post('/reset-password/:id/:token', LoginController.ResetPassword)


//modified by sahil
//login routes
apiRouter.post("/register", checkDuplicateEmail, registerController.register);
apiRouter.post("/login", LoginController.login);
apiRouter.patch("/change-password", LoginController.ChangePassword);
apiRouter.post('/reset-password-sendlink', LoginController.SendLinkForReset)
apiRouter.post('/reset-password/:id/:token', LoginController.ResetPassword)
apiRouter.put('/update-profile', LoginController.updateProfile);

//invoice routes
apiRouter.post("/addInvoice", InvoiceController.addInvoice);
apiRouter.get("/getby-invoiceid", InvoiceController.GetByInvoiceId);
apiRouter.post("/update-invoice", InvoiceController.updateInvoice)
apiRouter.delete("/delete-invoicebyid", InvoiceController.deleteByInvoiceId)
apiRouter.get("/get-all-invoice", InvoiceController.getAllInvoice)

//items routes
apiRouter.post("/product", ItemsController.addProduct);
apiRouter.put('/product', ItemsController.updateProduct);
apiRouter.get("/product", ItemsController.GetByProductId);
apiRouter.get("/products", ItemsController.getAllProducts);
apiRouter.delete('/product', ItemsController.deleteByProductId);

//customers routes
apiRouter.post("/customer", CustomerController.addCustomer);
apiRouter.put('/customer', CustomerController.updateCustomer);
apiRouter.get('/customers', CustomerController.getAllCustomers);
apiRouter.get('/customer', CustomerController.GetByCustomerId);
apiRouter.delete('/customer', CustomerController.deleteByCustomerId);
apiRouter.get('/customers-contact', CustomerController.getAllCustomersContact);

//address routes
apiRouter.put('/address', CustomerController.updateAddress);
apiRouter.get('/address', CustomerController.GetByAddressId);
apiRouter.get('/addresses', CustomerController.getAllAddress);
apiRouter.delete('/address', CustomerController.deleteByAddressId);

apiRouter.all('*', (req, res, next) =>
  error(res,404,"Route Un-available")
);

module.exports = apiRouter;