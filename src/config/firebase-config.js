const firebaseAdmin = require("firebase-admin");
const path = require('path');
const pathToServiceAccount = path.resolve('')
var serviceAccount = require(pathToServiceAccount);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),

})
module.exports.firebaseAdmin = firebaseAdmin
