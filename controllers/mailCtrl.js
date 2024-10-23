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

exports.forgotPassword = (email, link) => {
  console.log(link);
  
  ejs.renderFile(path.join(__dirname + "/../", "views", "forgotPassword.ejs"), { receiver: email, new_pass_link: link }, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var mailOptions = {
            from: '"Admin" testmail@zoho.com',
            to: email,
            subject: 'to do to win mot de passe oublié',
            html: data
        };
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

exports.reminder = (email) => {
  ejs.renderFile(path.join(__dirname + "/../", "views", "reminder.ejs"), { receiver: email }, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var mailOptions = {
            from: '"Admin" testmail@zoho.com',
            to: email,
            subject: 'to do to win rappel',
            html: data
        };
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