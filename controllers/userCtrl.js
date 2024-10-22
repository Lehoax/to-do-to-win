const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateAccessToken = require('../helpers/generateToken').generateAccessToken;
const generateRefreshToken = require('../helpers/generateToken').generateRefreshToken;
const jwt = require('jsonwebtoken');
const mailer = require('./mailCtrl');
require('dotenv').config();



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
  
exports.forgotPassword = async(req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:3000/resetPassword/${resetToken}`;

    const transporter = mailer.forgotPassword(email,  resetLink)

    await transporter

    res.status(200).json({ message: 'Lien de réinitialisation envoyé à votre adresse email.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur serveur. Veuillez réessayer plus tard.' });
  }
};
exports.updatePassword = async(req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Lien invalide ou expiré' });
  }
 
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
  const user = req.body.email;
  User.findOne({ email: user }).select('xp reminder')
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
  const userEmail = req.body.email; 
  const dataToUpdate = req.body.reminder;

  if (!userEmail) {
    return res.status(400).json({ message: 'Aucun utilisateur sélectionné.' });
  } 
  if (dataToUpdate === undefined) { 
    return res.status(400).json({ message: 'Aucun changement à apporter.' });
  } 
  
  User.findOneAndUpdate(
    { email: userEmail },
    { reminder: dataToUpdate },
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' }); 
      }
      return res.status(200).json({ message: 'Utilisateur mis à jour.', user }); 
    })
    .catch(err => {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
      return res.status(500).json({ message: 'Une erreur est survenue.' });
    });
};
  
 
 exports.delete = (req, res, next) => {
  const user = req.body.id;
  User.deleteOne({ _id: user })
         .then(user =>{
            return res.status(204).json({ message: 'deleted user'});
         }).catch(err =>{
            return res.status(500).json({ message: 'an error occured'});
         });
 };
 