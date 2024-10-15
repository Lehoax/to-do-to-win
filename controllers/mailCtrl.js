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

  // Configure the mailoptions object
const mailOptions = {
    from: 'leolair.pro@gmail.com',
    to: 'leolair.pro@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  // Send the email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });