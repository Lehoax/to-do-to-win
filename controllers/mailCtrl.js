var nodemailer = require('nodemailer');
const transporter = require('../helpers/transporter');
const path = require('path');
const ejs = require('ejs');

exports.welcome = (email) => {
  ejs.renderFile(path.join(__dirname + "/../", "views", "welcome.ejs"), { receiver: email }, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var mailOptions = {
            from: '"Admin" testmail@zoho.com',
            to: email,
            subject: 'bienvenue chez to do to win',
            html: data
        };
  // Send the email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}
});
}