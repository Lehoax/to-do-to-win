const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateAccessToken = require('../helpers/generateToken').generateAccessToken;
const generateRefreshToken = require('../helpers/generateToken').generateRefreshToken;
const jwt = require('jsonwebtoken');
const mailer = require('./mailCtrl');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => {
            mailer.welcome(req.body.email)
            res.status(201).json({ message: 'user create' })
          })
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.login = (req, res, next) => {
    const token = generateAccessToken({email: req.body.email});
    const refreshToken = generateRefreshToken({email: req.body.email});
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'incorrect login/password'});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'incorrect login/password' });
                }
                User.updateOne({ email: req.body.email }, {last_connection: Date.now()})
                .then(() => 
                res.status(200).json({
                    userId: user._id,
                    token: token,
                    refreshToken: refreshToken
                }));
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};

exports.refreshToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }
      User.findOne({ email: req.body.email })
        .then(user =>{
            if (!user) {
                return res.status(401).json({ message: 'your account no longer exists'});
            }
        })
      delete user.iat;
      delete user.exp;
      const refreshedToken = generateRefreshToken({email: req.body.email});
      res.send({
        accessToken: refreshedToken,
      });
    });
}
exports.profile = (req, res, next) => {
 const user = req.body.email;
 User.findOne({ email: user }, '_id email')
        .then(user =>{
            if (!user) {
                return res.status(401).json({ message: 'this user does not exist'});
            }
            delete user.password;
            res.send({
              user: user
            });
        })
};
exports.myxp = (req, res, next) => {
  const user = req.body.email;
  User.findOne({ email: user }, 'xp')
         .then(user =>{
             if (!user) {
                 return res.status(401).json({ message: 'this user does not exist'});
             }
             delete user.password;
             res.send({
               user: user
             });
         })
 };
 
exports.allUsers = (req, res, next) => {
  User.find({ }, '_id email')
         .then(users =>{
             if (!users) {
                 return res.status(401).json({ message: 'no user'});
             }
             res.send({
               users: users
              });
         });  
 };
 exports.update = (req, res, next) => {
  const user = req.body.id;
  const dataToUpdate = req.body.dataToUpdate;
  if (!user) {
    return res.status(400).json({ message: 'no user selected'});

  } 
  if (!dataToUpdate) {
    return res.status(400).json({ message: 'no changes to make'});

  } 
    User.findOneAndUpdate({ _id: user }, dataToUpdate)
         .then(user =>{
            return res.status(200).json({ message: 'updated user'});
         }).catch(err =>{
            return res.status(500).json({ message: 'an error occured'});
         });
  }
  
 
 exports.delete = (req, res, next) => {
  const user = req.body.id;
  User.deleteOne({ _id: user })
         .then(user =>{
            return res.status(204).json({ message: 'deleted user'});
         }).catch(err =>{
            return res.status(500).json({ message: 'an error occured'});
         });
 };
 