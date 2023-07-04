const express = require('express');
const bodyParser = require('body-parser')
const helmet = require('helmet')
const app = express();
const http = require('http');
var https = require('https');
var fs = require('fs');
var logger = require('./config/logger');
var morgan = require('morgan');
var morganBody = require('morgan-body');
var cors = require('cors');

const server = http.createServer(app);
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { NODE_ENV, PORT } = process.env;
const isProduction = NODE_ENV === 'production';

app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

app.use(express.static(path.join(process.cwd(), "public")));
app.set('views', path.join(__dirname,'views'));

// CORS middleware
app.use(cors());
app.options('*', cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// Body parser and helmet middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


morganBody(app, {
  prettify : true,
  includeNewLine : false,
  logAllReqHeader : true,
  logRequestId : true,
  stream: logger.stream
});

//Routes
app.use('/', require('./routes/adminRoutes'));
app.use('/api', require('./routes/apiRoutes'));

// Error Handler
app.use((err, req, res, next) =>
  res.status(500).json({
    message: 'Internal server error',
    error: isProduction ? null : err,
  }),
);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app
