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
    const token = generateAccessToken({ email: req.body.email });
    const refreshToken = generateRefreshToken({ email: req.body.email });
  
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'incorrect login/password' });
        }
  
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ message: 'incorrect login/password' });
            }
  
            User.updateOne({ email: req.body.email }, { last_connection: Date.now() })
              .then(() => {
                res.cookie('refreshToken', refreshToken, {
                  httpOnly: true,
                  secure: true,
                  sameSite: 'Strict',
                  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours d'expiration
                });
  
                return res.status(200).json({
                  userId: user._id,
                  token: token 
                });
              })
              .catch(err => {
                return res.status(500).json({ error: 'Erreur lors de la mise à jour de la connexion' });
              });
          })
          .catch(error => {
            return res.status(500).json({ error });
          });
      })
      .catch(error => {
        return res.status(500).json({ error });
      });
  };
  
exports.forgotPassword = (req, res, next) => {
  mailer.forgotPassword(req.body.email);
  res.status(200).json({ message: 'email réinitialisation du mot de passe envoyé' })
};
exports.updatePassword = (req, res, next) => {
  bcrypt.hash(req.body.newPassword, 10)
  .then(hash => {
    User.updateOne(
      { email: req.body.email },
      { $set: { password: hash } } 
    )
    .then(() => {
      res.status(200).json({ message: 'mot de passe modifié' })
    })
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
 
}
exports.refreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;  
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }

    User.findOne({ email: decoded.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'your account no longer exists' });
        }

        const refreshedToken = generateAccessToken({ email: user.email });
        return res.status(200).json({ accessToken: refreshedToken });
      })
      .catch(error => {
        return res.status(500).json({ error: 'Erreur lors de la recherche de l\'utilisateur' });
      });
  });
};

exports.profile = (req, res, next) => {
 const user = req.user.email;
 
 User.findOne({ email: user }, 'email')
        .then(user =>{
            if (!user) {
                return res.status(401).json({ message: 'this user does not exist'});
            }
            delete user.password;
            res.send({
              message: user.email,
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
 