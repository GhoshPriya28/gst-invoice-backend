const { constants } = require("../../helpers/constants.js");
var configFile = require('../../config/configFile.js');
const jwt = require("jsonwebtoken");

exports.getUserResponse = function(userResponseData,type = '',version='')
{	

	var profileImg = configFile.getBaseUrl()+constants.path.profileViewPath+'default.png';
	if(userResponseData.user_profile_pic)
	{
		var profileImg=configFile.getBaseUrl()+constants.path.profileViewPath+userResponseData.user_profile_pic;
	}

	let userData = {
		userId: userResponseData.id,
		first_name: userResponseData.first_name,
		last_name: userResponseData.last_name,
		email: userResponseData.email,
		is_password_change:(userResponseData.is_password_change == 1)?true:false,
	};

	if(type == '')
	{
		let payloadData = {
			userId: userResponseData.id,
			email: userResponseData.email,
		};
		//Prepare JWT token for authentication
		const jwtPayload = payloadData;
		const jwtData = {
			expiresIn: process.env.JWT_TIMEOUT_DURATION,
		};
		const secret = process.env.JWT_SECRET;
		//Generated JWT token with Payload and secret.	
		userData.token = jwt.sign(jwtPayload, secret, jwtData);
	}
	return userData;
}

exports.getItemsData= function(){
	
}