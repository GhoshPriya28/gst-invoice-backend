require('dotenv').config();
var nodemailer = require('nodemailer');
const sendEmail = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			service: process.env.SERVICE,
			auth: {
				user: process.env.USERNAME,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.USERNAME,
			to: email,
			subject: subject,
			text: text,
		});

		console.log("Email sent sucessfully");
	} catch (error) {
		console.log(error, "Email not sent");
	}
};
module.exports = sendEmail;

