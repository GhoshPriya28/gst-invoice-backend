const firebaseAdmin = require("firebase-admin");
const path = require('path');
const pathToServiceAccount = path.resolve('./src/config/switchtell-7bfb6-firebase-adminsdk-1tec0-6e80accbae.json')
var serviceAccount = require(pathToServiceAccount);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
//   databaseURL: "https://sample-project-e1a84.firebaseio.com"
})
module.exports.firebaseAdmin = firebaseAdmin