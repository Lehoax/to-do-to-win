const env = require('dotenv').config()
var nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    
    auth: {
      user: env.parsed.USER_MAIL,
      pass: env.parsed.PASS_MAIL,
    },
  });

module.exports = transporter