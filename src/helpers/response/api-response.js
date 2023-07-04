const responseCodeHelper = require("./response-code-helper.js");

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */
exports.success = (res, statusCode, message, results) => {
  	let data = {
		status: true,
		code: statusCode,
		message: message.toString(),
		data:results
	};
  	return res.status(statusCode).json(data);
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
exports.error = (res, statusCode, message) => {
  	const codes = [200, 201, 400, 401, 404, 403, 422, 500];
  	const findCode = codes.find((code) => code == statusCode);
  	if (!findCode) statusCode = 500;
  	else statusCode = findCode;
  	let data = {
		status: false,
		code: statusCode,
		message: message.toString(),
	};
  	return res.status(statusCode).json(data);
};

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
exports.validation = (res,errors) => {
  	let data = {
		status: false,
		code: 422,
		message: "Validation errors",
		data : errors
	};
  	return res.status(422).json(data);
};

/**
 * @desc    Send any Custom response
 *
 * @param   {object | array} errors
 */
exports.customResponse = (res,statusCode,message,errors = null) => {
	let data = {
	  status: false,
	  code: statusCode,
	  message: message.toString(),
	  data : errors
  };
	return res.status(200).json(data);
};